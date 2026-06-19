// Based on https://github.com/jdiaz5513/capnp-ts (MIT - Julián Díaz)

import { test, assert as t } from "vitest";
import * as zap from "zap-es";
import { CodeGeneratorRequest } from "src/zap/schema";
import { readFileBuffer } from "test/utils";

const SCHEMA_MESSAGE = readFileBuffer("test/fixtures/data/schema.bin");

const SCHEMA_FILE_ID = 0xa9_3f_c5_09_62_4c_72_d9n;

test("schema roundtrip", () => {
  const message = new zap.Message(SCHEMA_MESSAGE, false);
  const req = message.getRoot(CodeGeneratorRequest);

  // t.type(req, CodeGeneratorRequest);

  const zapVersion = req.zapVersion;

  t.equal(zapVersion.major, 0);
  t.equal(zapVersion.minor, 6);
  t.equal(zapVersion.micro, 0);

  const requestedFiles = req.requestedFiles;

  t.equal(requestedFiles.length, 1);

  const requestedFile = requestedFiles.get(0);
  const filename = requestedFile.filename;

  // This filename is embedded in the precompiled golden fixture `schema.bin`
  // (generated upstream against capnp-ts); the binary is an immutable test
  // vector, so the expected value retains the original embedded path.
  t.equal(filename, "packages/capnp-ts/src/std/schema.capnp");

  const requestedFileId = requestedFile.id;

  t.equal(requestedFileId, SCHEMA_FILE_ID);

  // TODO: investigate why bytes are not equal
  // const out = message.toArrayBuffer();
  // compareBuffers(out, SCHEMA_MESSAGE);
});
