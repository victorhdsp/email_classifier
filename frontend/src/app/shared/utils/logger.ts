/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      logger.log(...args)
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      logger.warn(...args)
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.DEV) {
      logger.error(...args)
    }
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      logger.info(...args)
    }
  },
}
