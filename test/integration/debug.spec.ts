import * as zap from "zap-es";
import { messageToString } from "../../src/debug";

import { test, describe, beforeAll, expect } from "vitest";
import {
  Person,
  Person_PhoneNumber_Type,
} from "../fixtures/serialization-demo";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const dirName = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(dirName, "../fixtures/serialization-demo.zap");

// messageToString() shells out to an external schema-aware decoder CLI.
// Resolve it from $ZAP_DECODER (CI may point this at a compatible decoder)
// or fall back to "zap" on PATH. When no decoder is installed the two
// spawn-based assertions below are skipped instead of hard-failing.
const decoder = process.env.ZAP_DECODER ?? "zap";
const hasDecoder =
  spawnSync(decoder, ["--version"], { stdio: "ignore" }).error === undefined;

let message: zap.Message;
let person: Person;

describe("messageToString", () => {
  beforeAll(() => {
    message = new zap.Message();
    person = message.initRoot(Person);
    person.name = "Jane Doe";
    person.id = 123;
    person._initPhones(1);
    const phone = person.phones.at(0);
    phone.number = "123-456-7890";
    phone.type = Person_PhoneNumber_Type.MOBILE;
    person.employment.unemployed = true;
  });
  test.skipIf(!hasDecoder)("zap", async () => {
    expect(
      await messageToString(message, Person, {
        zapPath: decoder,
        schemaPath,
        format: "zap",
      }),
    ).toMatchInlineSnapshot(`
      "( id = 123,
        name = "Jane Doe",
        phones = [
          (number = "123-456-7890", type = mobile) ],
        employment = (unemployed = void) )"
    `);
  });

  test.skipIf(!hasDecoder)("json", async () => {
    expect(
      await messageToString(message, Person, {
        zapPath: decoder,
        schemaPath,
        format: "json",
      }),
    ).toMatchInlineSnapshot(`
      "{ "id": 123,
        "name": "Jane Doe",
        "phones": [{"number": "123-456-7890", "type": "mobile"}],
        "employment": {"unemployed": null} }"
    `);
  });
});
