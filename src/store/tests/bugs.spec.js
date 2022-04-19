import {
  addBug,
  resolveBug,
  loadBugs,
  removeBug,
  assignBugToUser,
} from "../bugs";
import configureStore from "../configureStore";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getUnResolvedBugs, getBugsByUser } from "./../bugs";

describe("bugsSlice", () => {
  //
  let mockAxios;
  let store;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const createDummyState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  const bugsSlice = () => store.getState().entities.bugs;

  it("should removeBug from store if it is removed from server", async () => {
    const id = 1;
    mockAxios.onPost("/bugs").reply(200, { id: id });
    mockAxios.onDelete(`/bugs/${id}`).reply(200, {});

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(removeBug({ id: id }));

    expect(bugsSlice().list).toEqual([]);
  });

  it("should not removeBug from store if it is not removed from server", async () => {
    const id = 1;
    const bugData = { id: id };
    mockAxios.onPost("/bugs").reply(200, bugData);
    mockAxios.onDelete(`/bugs/${id}`).reply(500);

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(removeBug({ id: id }));

    expect(bugsSlice().list).toEqual([bugData]);
  });

  it("should add the bug to the store if it's saved to the server", async () => {
    // AAA: Arrange, Act, Assert
    // Arrange
    const bugData = { description: "a" };
    const savedBug = { ...bugData, id: 1 };
    mockAxios.onPost("/bugs").reply(200, savedBug);

    // Act
    await store.dispatch(addBug(bugData));

    // Assert
    const results = bugsSlice().list;
    // expect(results.length).toBe(1);
    // expect(results).toHaveLength(1);
    expect(results).toContainEqual(savedBug);
  });

  it("should not add the bug to the store if it's not saved to the server", async () => {
    // AAA: Arrange, Act, Assert
    // Arrange
    const bugData = { description: "a" };
    const savedBug = { ...bugData, id: 1 };
    mockAxios.onPost("/bugs").reply(500);

    // Act
    await store.dispatch(addBug(bugData));

    // Assert
    const results = bugsSlice().list;
    expect(results).toHaveLength(0);
  });

  it("should mark the bug as resolved if it's saved to the server", async () => {
    mockAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
    mockAxios.onPost("/bugs").reply(200, { id: 1, resolved: false });

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug({ id: 1 }));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  it("should not mark the bug as resolved if it's not saved to the server", async () => {
    mockAxios.onPatch("/bugs/1").reply(500);
    mockAxios.onPost("/bugs").reply(200, { id: 1, resolved: false });

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(resolveBug({ id: 1 }));

    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  it("should assignBugToUser in the store if there is not any error on the server side", async () => {
    const userId = 1;
    const bugId = 1;
    mockAxios.onPost("/bugs").reply(200, { id: bugId, userId: null });
    mockAxios
      .onPatch(`/bugs/${bugId}`)
      .reply(200, { id: bugId, userId: userId });

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(assignBugToUser({ bugId: bugId, userId: userId }));

    expect(bugsSlice().list[0].userId).toBe(userId);
  });

  it("should not assignBugToUser if there is an error on the server side", async () => {
    const userId = 1;
    const bugId = 1;
    mockAxios.onPost("/bugs").reply(200, { id: bugId, userId: null });
    mockAxios.onPatch(`/bugs/${bugId}`).reply(500);

    await store.dispatch(addBug({ description: "a" }));
    await store.dispatch(assignBugToUser({ bugId: bugId, userId: userId }));

    expect(bugsSlice().list[0].userId).toBe(null);
  });

  describe("loading bugs", () => {
    describe("if the bugs exist in the catch", () => {
      it("they should not be fetched from the server again", async () => {
        mockAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(mockAxios.history.get.length).toBe(1);
      });
    });
    describe("if the bugs don't exist in the catch", () => {
      it("they should be fetched from server and put in the store", async () => {
        mockAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });

      describe("the loading indicator", () => {
        it("should be true while fetching the bugs", () => {
          mockAxios.onGet("/bugs").reply(() => {
            expect(bugsSlice().loading).toBe(true);
            return [200, [{ id: 1 }]];
          });

          store.dispatch(loadBugs());
        });

        it("should be false after bugs are fetched", async () => {
          mockAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });

        it("should be false if the server returns an error", async () => {
          mockAxios.onGet("/bugs").reply(500);

          await store.dispatch(loadBugs());

          expect(bugsSlice().loading).toBe(false);
        });
      });
    });
  });

  // describe: selectores
  describe("selectors", () => {
    it("getUnresoledBugs", () => {
      const state = createDummyState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const result = getUnResolvedBugs(state);

      expect(result).toHaveLength(2);
    }); // it: getUnresoledBugs

    it("getBugsByUser", () => {
      const state = createDummyState();
      state.entities.bugs.list = [
        { id: 1, userId: 1 },
        { id: 2, userId: 2 },
        { id: 3, userId: 3 },
        { id: 4, userId: 1 },
        { id: 5, userId: 1 },
      ];

      console.log(state.entities.bugs.list);
      const result = getBugsByUser({ userId: 1 })(state);
      console.log(result);

      // expect(result).toHaveLength(3);
    });
  }); // describe: selectors
}); // describe: bugsSlice
