import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageChatReducer } from "./chatManager/slice";
import { manageRouteReducer } from "./routeManager/slice";
import { managePackageReducer } from "./packageManager/slice";
import { manageOrderDeliveryReducer } from "./orderManager/slice";
import { manageTripReducer } from "./tripManager/slice";
import { manageRatingReducer } from "./ratingManager/slice";
import { manageAccountReducer } from "./accountManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageChat: manageChatReducer,
  manageRoute: manageRouteReducer,
  managePackage: managePackageReducer,
  manageOrderDelivery: manageOrderDeliveryReducer,
  manageTrip: manageTripReducer,
  manageRating: manageRatingReducer,
  manageAccount: manageAccountReducer,
});
