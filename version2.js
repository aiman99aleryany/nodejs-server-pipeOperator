const { createServer } = require("node:http");
const fs = require("node:fs").promises;

const createTemplate = ({ path, host, port }) => {
  return {
    path: path,
    port: port,
    host: host,
    htmlContent: "",
    server: null,
  };
};

const fetchHtml = (template) => {
  return template.then((oldTemplate) => {
    let { path, htmlContent } = oldTemplate;
    const newTemplate = fs
      .readFile(path)
      .then((contents) => {
        htmlContent = contents;
        return { ...oldTemplate, htmlContent: String(htmlContent) };
      })
      .catch((err) => {
        console.error(`Could not read ok.html file: ${err}`);
      });
    return newTemplate;
  });
};

const initServer = (template) => {
  return template.then((oldTemplate) => {
    const { htmlContent } = oldTemplate;
    const requestListener = function (req, res) {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(htmlContent);
    };
    const newTemplate = {
      ...oldTemplate,
      server: createServer(requestListener),
    };
    return newTemplate;
  });
};

const initListening = (template) => {
  return template.then((oldTemplate) => {
    const { server, port, host } = oldTemplate;
    server.listen(port, host, () =>
      console.log(`server run on https://${host}:${port}`)
    );
    return oldTemplate;
  });
};

function pipe(...fns) {
  return async (value) => {
    return await fns.reduce(async (acc, fn) => ({ ...(await fn(acc)) }), value);
  };
}

const startServer = pipe(createTemplate, fetchHtml, initServer, initListening);

const run = async () => {
  const path = `${__dirname}/ok.html`;
  const port = 8000;
  const host = "localhost";
  const result = await startServer({ path, port, host });
  console.log(result);
};

run();
