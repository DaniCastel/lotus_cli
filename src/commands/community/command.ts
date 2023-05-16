import { program } from "../../index";
import { getCommunityPlugins } from "./action";

program
  .command("community")
  .description(
    "Get a CSV with the Moodle Community plugins and their latest version"
  )
  .action(() => {
    getCommunityPlugins();
  });
