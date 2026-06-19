// Based on https://github.com/jdiaz5513/capnp-ts (MIT - Julián Díaz)

import { test, assert as t } from "vitest";
import * as zap from "zap-es";

import { Baz } from "../fixtures/import-bar.ts";
import { Foo } from "../fixtures/import-foo.ts";

test("schema imports", () => {
  t.doesNotThrow(() => {
    new zap.Message().initRoot(Baz).bar = "bar";
    new zap.Message().initRoot(Foo)._initBaz().bar = "bar";
  });
});
