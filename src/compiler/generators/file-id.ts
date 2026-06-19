import type { CodeGeneratorFileContext } from ".";

/**
 * Generates a unique file identifier constant for a ZAP schema file.
 *
 * @param ctx - The file context containing schema information
 */

export function generateFileId(ctx: CodeGeneratorFileContext): void {
  ctx.codeParts.push(
    `export const _zapFileId = 0x${ctx.file.id.toString(16)}n;`,
  );
}
