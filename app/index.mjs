import routers from "./routers/index.mjs";
import session from "./session/index.mjs";
import { Server } from "http";
import io from "socket.io";
import redis from "redis";
import adapter from "socket.io-redis";
import {ioServer} from "./socket/index.mjs"


const IoServer = (app) => {
  const server = Server(app);
  const _redis = redis.createClient;
  const _io = io(server, {
    transports: ["websocket"],
  });
  const pubClient = _redis(6379, "127.0.0.1", {
    auth_pass: ""
  });
  const subClient = _redis(6379, "127.0.0.1", {
    auth_pass: "",
    return_buffers: true,
  });
  _io.adapter(
    adapter({
      pubClient: pubClient,
      subClient: subClient,
    })
  );

  _io.use((socket, next) => {
    session(socket.request, {}, next)
  })
  ioServer(_io);
  return server;
};

export default {
  routers,
  session,
  IoServer
};
