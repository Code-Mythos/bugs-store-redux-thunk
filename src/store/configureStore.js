import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";

// Get pre difined middlewares using getDefaultMiddleware
// Thunk is one of the default middlewares
// With thunk middleware, we can return a function instead 
// of an action in dispatch 
export default function () {
  return configureStore({
    reducer: reducer,
    middleware: [...getDefaultMiddleware(), logger],
  });
}
