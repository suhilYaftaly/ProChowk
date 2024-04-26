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
import review from "./review";
import contractorPortfolio from "./contractorPortfolio";
import message from "./message";

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
  notification,
  review,
  contractorPortfolio,
  message
);
