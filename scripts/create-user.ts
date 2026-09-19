// Maakt een gebruiker aan voor het platform. Registreren via de site staat uit, dus dit is de manier
// om de eerste platform-admin (of een medewerker) toe te voegen. Bestaat het e-mailadres al, dan kun je
// hiermee het wachtwoord opnieuw instellen (er is geen "wachtwoord vergeten"-mail).
//
//   npm run create-user
//
// Draai dit zelf in een terminal: het wachtwoord wordt verborgen ingetikt en nergens opgeslagen of getoond.
import readline from "node:readline";
import { auth } from "@/lib/auth";

const ROLES = ["platform-admin", "medewerker"] as const;

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // De prompt wel tonen, maar de getypte tekens niet terugschrijven.
      let prompted = false;
      (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s) => {
        if (!prompted) {
          process.stdout.write(s);
          prompted = true;
        }
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

function fail(message: string): never {
  console.error(`\n${message}`);
  process.exit(1);
}

async function askPassword(minLength: number): Promise<string> {
  const password = await ask(`Wachtwoord (minimaal ${minLength} tekens): `, true);
  if (password.length < minLength) fail(`Het wachtwoord moet minimaal ${minLength} tekens zijn.`);
  if (password !== (await ask("Wachtwoord nogmaals: ", true))) fail("De wachtwoorden zijn niet gelijk.");
  return password;
}

async function main() {
  if (!process.stdin.isTTY) fail("Draai dit script in een terminal (npm run create-user); het vraagt om een wachtwoord.");
  if (!process.env.BETTER_AUTH_SECRET) fail("BETTER_AUTH_SECRET ontbreekt in .env.local — zie .env.example.");

  const ctx = await auth.$context;
  const email = (await ask("E-mailadres: ")).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail("Dat is geen geldig e-mailadres.");
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing) {
    if ((await ask(`Er bestaat al een gebruiker met ${email}. Wachtwoord opnieuw instellen? (j/n): `)).toLowerCase() !== "j") {
      fail("Niets gewijzigd.");
    }
    const newPassword = await askPassword(ctx.password.config.minPasswordLength);
    await ctx.internalAdapter.updatePassword(existing.user.id, await ctx.password.hash(newPassword));
    await ctx.internalAdapter.deleteUserSessions(existing.user.id); // eventuele andere sessies loggen uit
    console.log(`\nKlaar: het wachtwoord van ${email} is gewijzigd.`);
    return;
  }

  const name = await ask("Naam: ");
  if (!name) fail("Naam is verplicht.");
  const roleInput = (await ask(`Rol (${ROLES.join(" / ")}) [platform-admin]: `)) || "platform-admin";
  const role = ROLES.find((r) => r === roleInput);
  if (!role) fail(`Onbekende rol "${roleInput}".`);

  const password = await askPassword(ctx.password.config.minPasswordLength);

  const user = await ctx.internalAdapter.createUser({ email, name, emailVerified: true, role }, { method: "admin" });
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: await ctx.password.hash(password),
  });
  console.log(`\nKlaar: ${name} <${email}> kan nu inloggen als ${role}.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
