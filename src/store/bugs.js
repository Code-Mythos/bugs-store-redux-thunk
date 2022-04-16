import { createAction } from "@reduxjs/toolkit";

// Action creators
// createAction returns a function that accepts a type and payload
// Indeed, it is an action creator
const bugAdded = createAction("bugs/bugAdded");
const bugResolved = createAction("bugs/bugResolved");
const bugRemoved = createAction("bugs/bugRemoved");

// Reducer
let lastId = 0;

export default function reducer(state = [], action) {
  switch (action.type) {
    case bugAdded.type:
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        },
      ];

    case bugRemoved.type:
      return state.filter((bug) => bug.id !== action.payload.id);

    case bugResolved.type:
      return state.map((bug) =>
        bug.id !== action.payload.id ? bug : { ...bug, resolved: true }
      );

    default:
      return state;
  }
}
