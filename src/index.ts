#! /usr/bin/env node
import figlet from "figlet";
import dotenv from "dotenv";

import { program } from "./program";
import { registerCommand } from "./commands/community/download";

dotenv.config();
console.log(figlet.textSync("Lotus CLI"));

registerCommand(program);

program
  .version("1.0.0")
  .description(
    "Lotus CLI is a tool created to manage Moodle plugins information"
  )
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
