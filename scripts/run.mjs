// Wrapper so the LinkedIn scripts report problems as a readable line instead of
// a Node stack trace. Expected failures here are configuration and API errors,
// not bugs, so the trace is noise.
export async function main(fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`\nFout: ${err.message}\n`);
    process.exit(1);
  }
}
