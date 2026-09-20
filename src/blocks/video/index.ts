import { defineBlock } from "../contract";
import { Video } from "./Component";
import { fixtures } from "./fixtures";
import { content, settings, variants } from "./schema";

export const video = defineBlock({
  slug: "video",
  label: "Video",
  description: "Een video van YouTube, Vimeo of een eigen bestand, met poster en klik-om-te-laden.",
  category: "Media",
  icon: "play-circle",
  status: "beta",
  variants,
  content,
  settings,
  fixtures,
  Component: Video,
});
