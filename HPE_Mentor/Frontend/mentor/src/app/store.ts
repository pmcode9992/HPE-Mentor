import { configureStore } from "@reduxjs/toolkit";
import accessControlReducer from "../features/acessControl/accessControl";
const store = configureStore({
  reducer: {
    accessControl: accessControlReducer
    
    // Add other reducers if needed
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;