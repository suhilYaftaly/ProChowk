import { Licenses, Skills } from "../../types/contractorTypes";
import { getErr } from "../funcs";

export const validateCreateContInput = (
  skills: Skills[] | undefined,
  licenses: Licenses[] | undefined
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
