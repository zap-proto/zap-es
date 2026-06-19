import { defineBuildConfig } from "unbuild";
import { fileURLToPath } from "node:url";
export default defineBuildConfig({
  declaration: true,
  entries: [
    "./src/index.ts",
    "./src/compiler/index.ts",
    "./src/compiler/zapc-js.ts",
    "./src/compiler/zapc-dts.ts",
    "./src/compiler/zapc-ts.ts",
    "./src/debug/index.ts",
    ...["cpp", "persistent", "rpc-twoparty", "rpc", "schema", "ts"].map(
      (n) => `./src/zap/${n}.ts`,
    ),
  ],
  alias: {
    "zap-es": fileURLToPath(new URL("src/index.ts", import.meta.url)),
  },
  hooks: {
    "rollup:options"(_ctx, rollupOptions) {
      rollupOptions.external = ["typescript"];
    },
  },
});
