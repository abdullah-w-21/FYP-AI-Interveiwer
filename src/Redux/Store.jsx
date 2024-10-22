import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import {
    useDispatch as useAppDispatch,
    useSelector as useAppSelector,
  } from "react-redux";
  import { rootPersistConfig, rootReducer } from "./RootReducer";
import { resetAuth } from "./Reducers/AuthReducers";
import { resetGeneration } from "./Reducers/QuestionsReducer";
// import { resetAccounts } from "./reducers/accountsReducer";
// import { resetCategories } from "./reducers/categoriesReducer";
// import { resetTransactions } from "./reducers/transactionsReducer";


const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
const persistor = persistStore(store);
const { dispatch } = store;

export function logOut() {
    return async () => {
      dispatch(resetAuth());
      dispatch(resetGeneration());
    //   dispatch(resetCategories());
    //   dispatch(resetTransactions());
      await persistor.purge();
      localStorage.clear();
    };
  }
  
  const useSelector = useAppSelector;
  
  const useDispatch = () => useAppDispatch();
  
  export { store, persistor, dispatch, useSelector, useDispatch };
