import { addBug, bugAdded } from "../bugs";
import { apiCallBegan } from "./../api";

const bugData = { description: "a" };

describe("bugsSlice", () => {
  //

  describe("action creators", () => {
    it("addBug", () => {
      const result = addBug({
        description: "a",
      });

      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bugData,
          onSuccess: bugAdded.type,
        },
      };

      expect(result).toEqual(expected);
    });

    
  });
});
