const toast = (store) => (next) => (action) => {
  if (action.type === "error") console.log("Tostify:", action.payload);
  else next(action);
};

export default toast;
