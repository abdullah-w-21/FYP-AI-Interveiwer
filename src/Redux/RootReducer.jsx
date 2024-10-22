import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

// Reducers
import authReducer from "./Reducers/AuthReducers";
import questionsReducer from "./Reducers/QuestionsReducer";

// ---------------------------------------------------------------------- //

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: ["auth", "questions"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  questions: questionsReducer
});

export { rootPersistConfig, rootReducer };