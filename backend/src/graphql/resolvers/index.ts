import userResolvers from "./user";
import userContractor from "./contractor";
import merge from "lodash.merge";
import dataList from "./dataList";
import googleMapKey from "./googleMapKey";

export default merge({}, userResolvers, userContractor, dataList, googleMapKey);
