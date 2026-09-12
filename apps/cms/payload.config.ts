import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
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
import { TimeEntries } from "./src/collections/TimeEntries";

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
    TimeEntries,
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
  // Media-uploads naar Cloudflare R2 (S3-compatible), zie doc §3.
  // Zonder R2_BUCKET blijft alles lokaal opgeslagen (prima voor development).
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${process.env.R2_PUBLIC_URL || ""}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT || "",
        forcePathStyle: true,
      },
    }),
  ],
});
