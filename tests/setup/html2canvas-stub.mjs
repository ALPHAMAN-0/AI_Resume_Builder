// Stand-in for html2canvas, which needs a real DOM. A test supplies the "rendered"
// canvas by assigning globalThis.html2canvasStub before it triggers an export.
export default function html2canvas(...args) {
  if (typeof globalThis.html2canvasStub !== 'function') {
    throw new Error('html2canvas is stubbed in tests: assign globalThis.html2canvasStub first')
  }
  return globalThis.html2canvasStub(...args)
}
