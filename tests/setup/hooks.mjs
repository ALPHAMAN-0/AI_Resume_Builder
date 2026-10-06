// Module hooks that let Node's built-in test runner load the app's TypeScript sources
// without a bundler and without extra dependencies:
//   - "@/x" resolves to src/x (the alias from vite.config.ts and tsconfig.json)
//   - extensionless imports resolve to .ts / .tsx
//   - .ts / .tsx sources are transpiled with the project's own TypeScript
//   - "jspdf" resolves to its browser build, the one Vite bundles into the app
//   - "html2canvas" resolves to a stub, because the real one needs a DOM
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const here = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(here, '../../src')

const SUBSTITUTES = {
  jspdf: 'jspdf/dist/jspdf.es.min.js',
  html2canvas: pathToFileURL(path.join(here, 'html2canvas-stub.mjs')).href,
}

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(SUBSTITUTES, specifier)) return nextResolve(SUBSTITUTES[specifier], context)

  const parent = context.parentURL ?? ''
  let base = null
  if (specifier.startsWith('@/')) {
    base = path.join(srcDir, specifier.slice(2))
  } else if (/^\.\.?\//.test(specifier) && parent.startsWith('file:') && !parent.includes('/node_modules/')) {
    base = path.resolve(path.dirname(fileURLToPath(parent)), specifier)
  }
  const file = base && [`${base}.ts`, `${base}.tsx`].find((candidate) => existsSync(candidate))
  if (file) return { url: pathToFileURL(file).href, shortCircuit: true }

  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && /\.tsx?$/.test(url)) {
    const fileName = fileURLToPath(url)
    const { outputText } = ts.transpileModule(await readFile(fileName, 'utf8'), {
      fileName,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        inlineSourceMap: true,
        inlineSources: true,
      },
    })
    return { format: 'module', source: outputText, shortCircuit: true }
  }

  if (url.endsWith('/jspdf/dist/jspdf.es.min.js')) {
    // An ES module shipped inside a CommonJS package: tell Node how to read it.
    return { format: 'module', source: await readFile(fileURLToPath(url)), shortCircuit: true }
  }

  return nextLoad(url, context)
}
