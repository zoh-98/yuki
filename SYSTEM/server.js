const { spawn } = require("child_process");
const { logger: log, boldText, Line } = require("./logger.js");


function startProject() {
  const child = spawn("node", ["Yuki.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code == 2) {
      log("Restarting Project...", 'warn');
      startProject();
    }
    if (!code) {
      process.exit();
    }
  });
}

startProject();
