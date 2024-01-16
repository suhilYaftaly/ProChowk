import userResolvers from "./user";
import userContractor from "./contractor";
import merge from "lodash.merge";
import googleMapKey from "./googleMapKey";
import address from "./address";
import job from "./job";
import skill from "./skill";
import log from "./log";
import jobBid from "./jobBid";
import notification from "./notification";

export default merge(
  {},
  userResolvers,
  userContractor,
  googleMapKey,
  address,
  job,
  skill,
  log,
  jobBid,
  notification
);
