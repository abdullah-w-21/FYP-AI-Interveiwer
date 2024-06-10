import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

// Reducers
import authReducer from "./Reducers/AuthReducers";

// ---------------------------------------------------------------------- //

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer
});

export { rootPersistConfig, rootReducer };