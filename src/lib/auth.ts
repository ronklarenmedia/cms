import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

/** Het inlogbeleid; ook getoond onder Instellingen → Beveiliging, zodat scherm en configuratie niet uit elkaar lopen. */
export const authPolicy = { minPasswordLength: 12, sessionDays: 7 } as const;

// Inloggen met e-mail en wachtwoord. Registreren staat uit: accounts worden bewust aangemaakt
// (`npm run create-user`), zodat niemand zichzelf toegang kan geven tot het platform.
export const auth = betterAuth({
  // BETTER_AUTH_SECRET en (optioneel) BETTER_AUTH_URL komen uit de omgeving; zie .env.example.
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: authPolicy.minPasswordLength,
  },
  session: {
    expiresIn: 60 * 60 * 24 * authPolicy.sessionDays,
    updateAge: 60 * 60 * 24, // verlengen bij gebruik, maximaal één keer per dag
  },
  user: {
    additionalFields: {
      // input: false — niemand kan zijn eigen rol of klant instellen via de API.
      role: { type: "string", required: false, defaultValue: "medewerker", input: false },
      customerId: { type: "string", required: false, input: false },
    },
  },
  plugins: [nextCookies()], // moet als laatste staan
});
