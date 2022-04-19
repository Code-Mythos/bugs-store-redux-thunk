import { addBug, resolveBug, loadBugs } from "../bugs";
import configureStore from "../configureStore";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getUnResolvedBugs } from "./../bugs";

describe("bugsSlice", () => {
  //
  let mockAxios;
  let store;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = (state) => store.getState().entities.bugs;

  const createDummyState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
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

  it("assignBugToUser", () => {});

  it("removeBug", () => {});

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

    it("getBugsByUser", () => {});
  }); // describe: selectors
}); // describe: bugsSlice
