import userResolvers from "./user";
import userContractor from "./contractor";
import merge from "lodash.merge";

export default merge({}, userResolvers, userContractor);
