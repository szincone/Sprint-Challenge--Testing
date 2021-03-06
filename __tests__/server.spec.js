const request = require("supertest");
const server = require("../server.js");
const gamesDb = require("../db/games.js");

describe("server.js", () => {
  describe("GET / (test route)", () => {
    it("returns a 200 (OK) status code", async () => {
      const response = await request(server).get("/");

      expect(response.status).toEqual(200);
    });

    it("correctly passing req.body check", async () => {
      const expectedBody = { api: "running" };
      const response = await request(server).get("/");

      expect(response.body).toEqual(expectedBody);
    });
  });

  describe("Game Routes", () => {
    describe("GET ALL games", () => {
      it("returns a 200 (OK) status code", async () => {
        const response = await request(server).get("/games");

        expect(response.status).toEqual(200);
      });
      it("should display a list of all games", async () => {
        const response = await request(server).get("/games");

        expect(response.body).toEqual(gamesDb.games);
      });
      // (unskip and comment out games in db to test)
      it.skip("should return empty array if no games are stored", async () => {
        const response = await request(server).get("/games");
        expect(response.body).toEqual([]);
      });
    });

    describe("GET SINGLE game", () => {
      it("returns a 200 (OK) status code", async () => {
        const response = await request(server).get("/games/0");

        expect(response.status).toEqual(200);
      });
      it("should display individual game", async () => {
        const response = await request(server).get("/games/0");

        expect(response.body).toEqual([gamesDb.games[0]]);
      });
      it("should display missing game message if game not found", async () => {
        const response = await request(server).get("/games/11");
        const expectedResponse = gamesDb.errMessage;
        expect(response.body).toEqual(expectedResponse);
      });
    });

    describe("POST new game", () => {
      it("should display all games (including newGame)", async () => {
        const updatedGameData = gamesDb.games;
        const newGame = gamesDb.newGame;
        const response = await request(server)
          .post("/games")
          .send(newGame);
        // 3 is the index of our new game
        // expect(response.body[3]).toEqual(updatedGameData[3]);
        expect(response.body).toEqual(updatedGameData);
      });
      it("returns a 200 (OK) status code", async () => {
        const newGame = gamesDb.newGame;
        const response = await request(server)
          .post("/games")
          .send(newGame);
        expect(response.status).toEqual(200);
      });
      it("returns a 422 (NO-K) status code if missing required field in body", async () => {
        const response = await request(server).post("/games");
        // not sending body, so should get 422
        expect(response.status).toEqual(422);
      });
    });
  });
});
