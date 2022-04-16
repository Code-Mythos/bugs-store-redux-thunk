// With Redux Toolkit we do not need to import devToolsEnhancer and also
// we can aply asynchroneous logic to the store (dispatch asynchroneously)
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./bugs";

export default function () {
  return configureStore({
    reducer: reducer,
  });
}
