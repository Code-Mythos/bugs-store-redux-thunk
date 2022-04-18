const toast = (store) => (next) => (action) => {
  if (action.type === "error") console.log("Tostify:", action.payload);
  return next(action);
};

export default toast;
