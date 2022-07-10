"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("./server");
const uuid_1 = require("uuid");
const roomRouter = express_1.Router();
roomRouter.get("/rooms", (_, res) => {
    return res.json(server_1.rooms);
});
roomRouter.post("/newRoom", (_, res) => {
    const newRoom = new Room(uuid_1.v4(), "blabla");
    server_1.rooms.push(newRoom);
    return res.json(newRoom);
});
exports.default = roomRouter;
//# sourceMappingURL=roomRouter.js.map