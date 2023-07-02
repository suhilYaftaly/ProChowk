import { License, Skill } from "../../types/contractorTypes";
import { getErr } from "../funcs";

export const validateCreateContInput = (
  skills: Skill[] | undefined,
  licenses: License[] | undefined
) => {
  if (skills && skills.length === 0)
    return getErr("At least one skill is required");

  if (licenses) {
    for (const license of licenses) {
      if (!license.name || !license.type || !license.desc || !license.picture) {
        return getErr("Invalid licenses input");
      }
    }
  }
};
