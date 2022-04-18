import configureStore from "./store/configureStore";
import {
  bugAdded,
  bugRemoved,
  bugResolved,
  bugAssignedToUser,
  getUnResolvedBugs,
  getBugsByUser,
} from "./store/bugs";
import { projectAdded } from "./store/projects";
import { userAdded } from "./store/users";
import * as apiActions from "./store/api";

const store = configureStore();

store.dispatch(
  apiActions.apiCallBegan({
    url: "/bugs",
    onSuccess: "bugsReceived",
    // onError: apiActions.apiCallFailed.type, // Best to be implemented inside the api middleware
  })
);
