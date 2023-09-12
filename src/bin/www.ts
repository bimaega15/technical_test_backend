import app from "../app";
import http from "http";
import { config as dotenv } from "dotenv";
import debug from "debug";

class ServerStart {
  public port;
  constructor() {
    this.plugins();
    this.port = this.onPort();
    this.onServer();
  }

  protected plugins(): void {
    dotenv();
  }

  protected onPort(): number {
    const normalizePort = (val: any) => {
      const port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    };

    const setPort = normalizePort(process.env.NODE_PORT || "3000");
    return setPort;
  }

  protected onServer() {
    const onListening = (): any => {
      const addr = server.address();
      const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
      debug("Listening on " + bind);

      console.log("Server running on port " + bind);
    };

    const onError = (error: any) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind =
        typeof this.port === "string"
          ? "Pipe " + this.port
          : "Port " + this.port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    };

    const server = http.createServer(app);
    server.listen(this.port);
    server.on("listening", onListening);
    server.on("error", onError);
  }
}

new ServerStart();
