"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const peer_1 = require("peer");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const roomRouter_1 = __importDefault(require("./roomRouter"));
const app = express_1.default();
const httpServer = new http_1.Server(app);
const io = new socket_io_1.Server(httpServer);
const peerServer = peer_1.ExpressPeerServer(httpServer);
exports.rooms = [];
app.use(cors_1.default({
    origin: "*",
}));
app.use("/peerjs", peerServer);
app.use("/", roomRouter_1.default);
httpServer.listen(5000);
//# sourceMappingURL=server.js.map