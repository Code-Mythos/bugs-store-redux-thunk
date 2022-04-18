import axios from "axios";
import * as apiActions from "../api";

// const action = {
//   type: "apiCallBegan",
//   payload: {
//     url: "/bugs",
//     method: "get",
//     data: {},
//     onSuccess: "bugsReceived",
//     onError: "apiRequestFailed",
//   },
// };
const api = (store) => (next) => async (action) => {
  const { dispatch } = store;
  if (action.type !== apiActions.apiCallBegan.type) return next(action);

  const { url, method, data, onSuccess, onError, onStart } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      baseURL: "http://localhost:9001/api",
      url,
      method,
      data,
    });
    // General success
    dispatch(apiActions.apiCallSuccess(response.data));
    // Specific success
    if (onSuccess) {
      dispatch({
        type: onSuccess,
        payload: response.data,
      });
    }
  } catch (error) {
    // General error handling
    dispatch(apiActions.apiCallFailed(error));
    // Specific error handling
    if (onError) {
      dispatch({
        type: onError,
        payload: error,
      });
    }
  }
};

export default api;
