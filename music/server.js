import app from "./app.js";
import config from './config/config.js'
import { connectDb } from './config/databse.js'
import initSocketServer from "./sockets/socket.server.js";
import http from "http";

const httpServer = http.createServer(app);
initSocketServer(httpServer);

connectDb()


httpServer.listen(config.PORT, () => {
  console.log(`music service start on the ${config.PORT} port`);
});
