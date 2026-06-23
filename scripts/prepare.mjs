import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const skip =
  process.env.HUSKY === "0" ||
  process.env.CI === "true" ||
  process.env.RENDER === "true" ||
  process.env.NODE_ENV === "production" ||
  !existsSync(".git");

if (skip) {
  process.exit(0);
}

try {
  execSync("husky", { stdio: "inherit" });
} catch {
  process.exit(0);
}
