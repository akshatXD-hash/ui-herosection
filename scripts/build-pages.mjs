import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build", "--webpack"],
  {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/ui-herosection" },
  },
);
process.exit(result.status ?? 1);
