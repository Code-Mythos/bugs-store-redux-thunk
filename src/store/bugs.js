import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const url = "/bugs";
const catchingDurationInMinutes = 1;

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
      bugsState.lastFetch = Date.now();
    },

    bugAdded: {
      reducer(bugsState, action) {
        bugsState.list.push(action.payload);
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
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < catchingDurationInMinutes) return;

  dispatch(
    apiCallBegan({
      url: url,
      onStart: bugsRequested.type,
      onSuccess: bugsResieved.type,
      onError: bugsRequestFailed.type,
    })
  );
};

export const addBug = (bugsState) =>
  apiCallBegan({
    url: url,
    method: "post",
    data: bugsState,
    onSuccess: bugAdded.type,
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
