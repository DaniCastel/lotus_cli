#! /usr/bin/env node

import {
  filterPluginVersions,
  createCommunityPluginsCSV,
} from "./utils/csvPluginsWriter";

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");
const axios = require("axios").default;
const { Command } = require("commander");

const program = new Command();

console.log(figlet.textSync("Lotus CLI"));

program
  .name("string-util")
  .description("CLI to some JavaScript string utilities")
  .version("0.1.0");

program
  .command("community")
  .description(
    "Get a CSV with the Moodle Community plugins and their latest version"
  )
  .action(() => {
    getCommunityPlugins();
  });

program
  .version("1.0.0")
  .description(
    "Lotus CLI is a tool created to manage Moodle plugins information"
  )
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

async function listDirContents(filepath: string) {
  try {
    const files = await fs.promises.readdir(filepath);
    const detailedFilesPromises = files.map(async (file: string) => {
      let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { filename: file, "size(KB)": size, created_at: birthtime };
    });
    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
  } catch (error) {
    console.error("Error occurred while reading the directory!", error);
  }
}

function createDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log("The directory has been created successfully");
  }
}

function createFile(filepath: string) {
  fs.openSync(filepath, "w");
  console.log("An empty file has been created");
}

async function getCommunityPlugins() {
  try {
    console.log("Fetching Moodle directory plugins...");
    let response = await axios.get(
      `${process.env.MOODLE_API}/1.3/pluglist.php`
    );
    const transformedPlugins = filterPluginVersions(response.data.plugins);
    createCommunityPluginsCSV(transformedPlugins, __dirname);
  } catch (error) {
    console.error("Error occurred fetching plugins", error);
  }
}

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  listDirContents(filepath);
}

if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}

if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
