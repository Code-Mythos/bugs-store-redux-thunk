import * as actions from "./actionTypes";

const bugAdded = (description) => {
  return {
    type: actions.BUG_ADDED,
    payload: {
      description: description,
    },
  };
};

const bugRemoved = (id) => {
  return {
    type: actions.BUG_REMOVED,
    payload: {
      id: id,
    },
  };
};

const bugResolved = (id) => {
  return {
    type: actions.BUG_RESOLVED,
    payload: {
      id: id,
    },
  };
};

export { bugAdded, bugRemoved, bugResolved };
