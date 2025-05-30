import { combineReducers } from "@reduxjs/toolkit";
import { manageAuthenReducer } from "./authentManager/slice";
import { manageChatReducer } from "./chatManager/slice";

export const rootReducer = combineReducers({
  manageAuthen: manageAuthenReducer,
  manageChat: manageChatReducer,
});
