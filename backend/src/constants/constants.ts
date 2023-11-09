import * as dotenv from "dotenv";

dotenv.config();

const mqKey = process.env.MAP_QUEST_KEY;
const mqSuhilKey = process.env.MAP_QUEST_KEY_SUHIL;
const mqAJKey = process.env.MAP_QUEST_KEY_AJ;
const mqHabibKey = process.env.MAP_QUEST_KEY_HABIB;
export const MAP_QUEST_KEYS = [mqKey, mqSuhilKey, mqAJKey, mqHabibKey];

export const appName = "nexabind";
/**app name in PascalCase format */
export const appNamePascalCase = "NexaBind";
