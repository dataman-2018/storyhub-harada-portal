const fs = require("fs");
const path = require("path");

const ROUTES = {
  "/": "index.html",
  "/lp": "lp/index.html",
  "/ops": "ops/index.html",
  "/about": "about/index.html",
};

const CREDENTIALS = "storyhub:ensemble";
const ENCODED = Buffer.from(CREDENTIALS).toString("base64");

module.exports = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Basic ${ENCODED}`) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Proposal Portal"');
    res.statusCode = 401;
    return res.end("Unauthorized");
  }

  const route = req.url.replace(/\/$/, "") || "/";
  const file = ROUTES[route];
  if (!file) {
    res.statusCode = 404;
    return res.end("Not Found");
  }

  const filePath = path.join(__dirname, "..", file);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.statusCode = 500;
      return res.end("Internal Server Error");
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.end(data);
  });
};
