import type { Message, Struct } from "zap-es";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

/**
 * Converts a ZAP message to a human-readable string representation.
 *
 * This function uses the ZAP command-line tool to convert a binary message
 * to either text or JSON format. It is slow and should be used for debug only.
 *
 * @param message The ZAP message to convert
 * @param struct The struct type or display name of the message
 * @param zapPath Path to the ZAP executable (defaults to "zap")
 * @param format Output format, either "text" or "json" (defaults to "text")
 * @param schemaPath Path to the ZAP schema file. Absolute or relative to cwd.
 *
 * @returns A promise that resolves to the string representation of the message
 */
export function messageToString(
  message: Message,
  struct: typeof Struct | string,
  {
    zapPath,
    format,
    schemaPath,
  }: {
    zapPath?: string;
    format?: "zap" | "json";
    schemaPath?: string;
  } = {},
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (schemaPath === undefined || !existsSync(schemaPath)) {
      throw new Error(`Schema not found at "${schemaPath}"`);
    }

    const anyStruct = struct as any;
    const type = anyStruct?._zap?.displayName ?? struct;

    if (typeof type !== "string") {
      // eslint-disable-next-line unicorn/prefer-type-error
      throw new Error("Can not determine the struct type");
    }

    const outputFormat = format === "json" ? "json" : "text";

    const args = ["convert", `binary:${outputFormat}`, schemaPath, type];

    const process = spawn(zapPath ?? "zap", args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    process.on("error", (error: Error) => {
      reject(new Error(`Failed to start process: ${error.message}`));
    });

    process.on("close", (code: number | null) => {
      if (code === 0) {
        resolve(stdout.endsWith("\n") ? stdout.slice(0, -1) : stdout);
      } else {
        reject(
          new Error(`Process exited with code ${code}. Stderr: ${stderr}`),
        );
      }
    });

    try {
      process.stdin.write(Buffer.from(message.toArrayBuffer()));
      process.stdin.end();
    } catch (error: any) {
      reject(new Error(`Error writing to stdin: ${error.message}`));
    }
  });
}
