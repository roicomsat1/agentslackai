import { execSync } from "node:child_process";
if (process.env.DATABASE_URL) {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} else {
  console.log("[db-push] DATABASE_URL not set — skipping schema push (app runs in no-database mode).");
}
