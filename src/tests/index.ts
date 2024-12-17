/* eslint-disable @typescript-eslint/no-explicit-any */
import { setupMonacoEnv, loadOnigasm } from "./env";
import * as monaco from "monaco-editor-core";
import { loadGrammars, loadTheme } from "../index";
import { getOrCreateModel } from "../utils";
import data from "./Test.vue?raw";
import { computed, ref } from "vue";
const code = ref(data);

function parseVue(content: string) {
  const templateMatch = content.match(/<template>([\s\S]*)<\/template>/);
  const scriptMatch = content.match(
    /<script(?: lang="ts")?>([\s\S]*)<\/script>/
  );
  const styleMatch = content.match(/<style>([\s\S]*)<\/style>/);

  const template = templateMatch ? templateMatch[1].trim() : "";
  let script = scriptMatch ? scriptMatch[1].trim() : "";
  const style = styleMatch ? styleMatch[1].trim() : "";
  // remove export default
  script = script.replace(/export default/, "").trim();
  return {
    script: `{
      ${script.slice(1, -1)}
      template: "#app-template"
    }`,
    style: `<style type="text/css">
    * {
      margin: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      background-color: black;
      color: white;
      margin: 0;
      padding: 0;
    }
    ${style}
    </style>`,
    template: `<script type="text/x-template" id="app-template">
      ${template.replace(/export default/, "")}
    </script>`,
  };
}

export const iframeCode = computed(() => {
  const { script, style, template } = parseVue(code.value);
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Vue Preview</title>
    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
    <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
        }
      }
    </script>
    <!--TEMPLATE-->
    <script type="module">
      import { createApp, defineAsyncComponent } from "vue";
      try {
        const app = createApp(/*SCRIPT*/);
        app.mount("#app");
      } catch (e) {
        document.getElementById("errorMessage").textContent = e.message;
      }
    </script>
    <!--CSS-->
    <style type="text/css">
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(5px);
    }

    .overlay[aria-hidden='true'] {
      display: none;
    }

    .popup {
      background: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  </style>
  </head>
  <body>
    <div id="app">
      <div class="overlay">
        <div class="popup">
          <p id="errorMessage">No Error</p>
        </div>
      </div>
    </div>
  </body>
</html>`
    .replace("/*SCRIPT*/", script)
    .replace("<!--CSS-->", style)
    .replace("<!--TEMPLATE-->", template);
  console.log(html);
  return html;
});

const afterReady = (theme: string, element: HTMLElement) => {
  const model = getOrCreateModel(
    monaco.Uri.parse("file:///demo.vue"),
    "vue",
    code.value
  );
  const editorInstance = monaco.editor.create(element, {
    theme,
    model,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: false,
    },
    "semanticHighlighting.enabled": true,
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoSurround: "languageDefined",
    formatOnType: true,
    autoIndent: "full",
  });

  // Monitor live code changes
  editorInstance.onDidChangeModelContent(() => {
    code.value = model.getValue();
  });

  // Support for semantic highlighting
  const t = (editorInstance as any)._themeService._theme;
  t.getTokenStyleMetadata = (
    type: string,
    modifiers: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _language: string
  ) => {
    const _readonly = modifiers.includes("readonly");
    switch (type) {
      case "function":
      case "method":
        return { foreground: 12 };
      case "class":
        return { foreground: 11 };
      case "variable":
      case "property":
        return { foreground: _readonly ? 21 : 9 };
      default:
        return { foreground: 0 };
    }
  };

  loadGrammars(monaco, editorInstance);
};

export default function setEditor(element: HTMLElement) {
  Promise.all([setupMonacoEnv(), loadOnigasm(), loadTheme(monaco.editor)]).then(
    ([, , theme]) => {
      afterReady(theme.dark, element);
    }
  );
}
