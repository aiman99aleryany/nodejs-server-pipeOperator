import { createServer } from "node:http";
import fs from "node:fs";

const port = 3000;
const hostname = "127.0.0.1";
const __okResponseFile = `./ok.html`;

const initResponse = (path, initSer) => {
  fs.readFile(path, (err, html) => {
    if (err) throw err;
    initSer(html);
  });
};

const initFailure = () => {
  console.log("HTML response not found.");
};

const initServer = (html) => {
  if (!html) {
    initFailure();
    return;
  }
  const server = createServer((req, res) => {
    console.log("request established");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(html);
  });

  server.listen(port, hostname, () => {
    console.log(`server started at http://${hostname}:${port}`);
  });
};

initResponse(__okResponseFile, initServer);
