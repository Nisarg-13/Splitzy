import { execSync } from "node:child_process";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

const vercelEnv = process.env.VERCEL_ENV;

if (vercelEnv === "production") {
  run("npx convex deploy --cmd 'npm run build'");
} else {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    console.error(
      [
        "Preview build failed: NEXT_PUBLIC_CONVEX_URL is not set.",
        "",
        "For preview deployments, set NEXT_PUBLIC_CONVEX_URL in Vercel for the Preview environment.",
        "",
        "Also ensure CONVEX_DEPLOY_KEY (production) is scoped to Production only in Vercel.",
        "Do not enable the production deploy key for Preview or Development.",
      ].join("\n")
    );
    process.exit(1);
  }

  console.log(
    `Preview build (${vercelEnv ?? "unknown"}): skipping Convex deploy, using NEXT_PUBLIC_CONVEX_URL`
  );
  run("npm run build");
}
