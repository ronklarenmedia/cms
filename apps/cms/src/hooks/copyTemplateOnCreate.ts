import type { CollectionBeforeChangeHook } from "payload";

// Kopieerpunt, geen levende koppeling (zie doc §6): bij het aanmaken van
// een site wordt het gekozen sjabloon één keer overgenomen in site.theme.
// Latere wijzigingen aan het sjabloon raken deze site dus nooit meer.
export const copyTemplateOnCreate: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create" || !data.startingTemplate) {
    return data;
  }

  const template = await req.payload.findByID({
    collection: "site-templates",
    id: data.startingTemplate,
  });

  if (template?.theme && !data.theme) {
    data.theme = template.theme;
  }

  return data;
};
