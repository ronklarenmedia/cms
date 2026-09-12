import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Clients } from "./src/collections/Clients";
import { Plugins } from "./src/collections/Plugins";
import { ApiConnections } from "./src/collections/ApiConnections";
import { SiteTemplates } from "./src/collections/SiteTemplates";
import { Sites } from "./src/collections/Sites";
import { SitePlugins } from "./src/collections/SitePlugins";
import { Pages } from "./src/collections/Pages";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Clients,
    Plugins,
    ApiConnections,
    SiteTemplates,
    Sites,
    SitePlugins,
    Pages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  // Media-uploads gaan naar Cloudflare R2 via de S3-adapter, zie doc §3.
  // Toe te voegen zodra de R2-bucket/credentials er zijn:
  // plugins: [s3Storage({ collections: { media: true }, bucket: ..., config: {...} })]
});
