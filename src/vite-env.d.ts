/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module "monaco-editor-core/esm/vs/editor/editor.worker" {
  export function initialize(
    callback: (ctx: any, createData: any) => any
  ): void;
}
