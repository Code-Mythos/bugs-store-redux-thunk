import { createSlice } from "@reduxjs/toolkit";

// Create both the reducer and the action creators in one step using createSlice.
let lastId = 0;

const slice = createSlice({
  name: "bugs",
  initialState: [],
  reducers: {
    bugAdded: {
      reducer(state, action) {
        state.push({
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        });
      },
    },

    bugResolved: {
      reducer(state, action) {
        const index = state.findIndex((bug) => bug.id === action.payload.id);
        state[index].resolved = true;
      },
    },

    bugRemoved: {
      reducer(state, action) {
        const index = state.findIndex((bug) => bug.id === action.payload.id);
        state.splice(index, 1);
      },
    },
  },
});

export const { bugAdded, bugResolved, bugRemoved } = slice.actions;
export default slice.reducer;
