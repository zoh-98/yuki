const { spawn } = require("child_process");
const { logger: log, boldText, Line } = require("./logger.js");

function startProject() {
  const child = spawn("node", ["Yuki.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code === 2) {
      log("Restarting Project...", 'warn');
      setTimeout(() => startProject(), 1000);
    } else if (code !== 0) {
      log(`Child process exited with code ${code}`, 'error');
      process.exit(code);
    } else {
      log("Child process exited successfully.", 'info');
      process.exit(0);
    }
  });
}

startProject();
