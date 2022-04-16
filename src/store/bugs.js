import { createAction, createReducer } from "@reduxjs/toolkit";

// Action creators
// createAction returns a function that accepts a type and payload
// Indeed, it is an action creator
export const bugAdded = createAction("bugs/bugAdded");
export const bugResolved = createAction("bugs/bugResolved");
export const bugRemoved = createAction("bugs/bugRemoved");

// Reducer
let lastId = 0;

export default createReducer([], {
  [bugAdded.type]: (state, action) => {
    state.push({
      id: ++lastId,
      ...action.payload,
    });
  },

  [bugResolved.type]: (state, action) => {
    const index = state.findIndex((bug) => bug.id === action.payload.id);
    state[index].resolved = true;
  },

  [bugRemoved.type]: (state, action) => {
    const index = state.findIndex((bug) => bug.id === action.payload.id);
    state.splice(index, 1);
  },
});
