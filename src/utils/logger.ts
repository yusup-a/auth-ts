/**
 * Minimal structured logger.
 * Replace with a real logger (pino/winston) later if desired.
 */

type Fields = Record<string, unknown>;

function ts() {
  return new Date().toISOString();
}

function log(level: "debug" | "info" | "warn" | "error", msg: string, fields?: Fields) {
  const line = {
    time: ts(),
    level,
    msg,
    ...(fields ?? {}),
  };
  console.log(JSON.stringify(line));
}

export const logger = {
  debug: (msg: string, fields?: Fields) => log("debug", msg, fields),
  info: (msg: string, fields?: Fields) => log("info", msg, fields),
  warn: (msg: string, fields?: Fields) => log("warn", msg, fields),
  error: (msg: string, fields?: Fields) => log("error", msg, fields),
};
