import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

let lastId = 0;

const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequestFailed: (bugsState, action) => {
      bugsState.loading = false;
    },

    bugsRequested: (bugsState, action) => {
      bugsState.loading = true;
    },

    bugsResieved: (bugsState, action) => {
      bugsState.list = action.payload;
      bugsState.loading = false;
    },

    bugAdded: {
      reducer(bugsState, action) {
        bugsState.list.push({
          id: ++lastId,
          description: action.payload.description,
          resolved: false,
        });
      },
    },

    bugResolved: {
      reducer(bugsState, action) {
        const index = bugsState.list.findIndex(
          (bug) => bug.id === action.payload.id
        );
        bugsState.list[index].resolved = true;
      },
    },

    bugRemoved: {
      reducer(bugsState, action) {
        const index = bugsState.list.findIndex(
          (bug) => bug.id === action.payload.id
        );
        bugsState.list.splice(index, 1);
      },
    },

    bugAssignedToUser: (bugsState, action) => {
      const { bugId, userId } = action.payload;
      const index = bugsState.list.findIndex((bug) => bug.id === bugId);
      bugsState.list[index].userId = userId;
    },
  },
});

export const {
  bugsRequestFailed,
  bugsRequested,
  bugsResieved,
  bugAdded,
  bugResolved,
  bugRemoved,
  bugAssignedToUser,
} = slice.actions;
export default slice.reducer;

// Action creators
const url = "/bugs";

export const loadBugs = () =>
  apiCallBegan({
    url: url,
    onStart: bugsRequested.type,
    onSuccess: bugsResieved.type,
    onError: bugsRequestFailed.type,
  });

// Selectors
export const getUnResolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.filter((bug) => !bug.resolved)
);

export const getBugsByUser = ({ userId }) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );
