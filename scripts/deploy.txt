const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

console.log("Deploying to the following networks:");

// get the configs directories
const configPath = path.join(__dirname, "../configs");
const directories = fs.readdirSync(configPath);

// get config files for directories
const configFiles = directories.map(dir => {
  const p = path.join(configPath, dir);
  return fs.readdirSync(p);
});

directories.forEach((directory, i) => {
  console.log(directory);
  configFiles[i].forEach(file => {
    console.log("   ", file);
  });
});

// we want to loop through the config folders and replace the top-level networks.json and subgraph.yaml
const topLevel = path.join(__dirname, "..");
directories.forEach((dir, i) => {
  const files = configFiles[i];

  // remove the old files
  try {
    fs.unlinkSync(path.join(topLevel, "networks.json"));
    fs.unlinkSync(path.join(topLevel, "subgraph.yaml"));
  } catch {
    // do nothing
  }

  // replace with new files
  files.forEach(file => {
    const content = fs.readFileSync(path.join(configPath, dir, file), {
      encoding: "utf-8"
    });
    if (file.endsWith("json")) {
      fs.writeFileSync(path.join(topLevel, "networks.json"), content);

      // replace hardcoded address in registry.ts with the one in the json, line 4
      // hope it doesnt lint :fingers_crossed:
      const address = content.split("\n")[3].split('"')[3];

      const registryContent = fs
        .readFileSync(path.join(topLevel, "src", "registry.ts"), {
          encoding: "utf-8"
        })
        .split("\n");
      // should be line 18
      registryContent[18] = `"${address}"`;
      const joinedContent = registryContent.join("\n");

      fs.writeFileSync(
        path.join(topLevel, "src", "registry.ts"),
        joinedContent
      );
    } else {
      fs.writeFileSync(path.join(topLevel, "subgraph.yaml"), content);
    }
  });

  // run depoyment script
  const deployUrl = `horse-link/horselink-${dir}-test`;
  console.log(`\ndeploying to ${deployUrl}...`);
  childProcess.execSync(
    `graph deploy --node https://api.thegraph.com/deploy/ ${deployUrl}`,
    { encoding: "utf-8", stdio: "ignore" }
  );
  console.log("done!");
});
