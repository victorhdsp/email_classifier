/* eslint-disable @typescript-eslint/no-explicit-any */

/*
  Wrapper para adicionar eventuais ferramentas de logs, seja internamente ou externas.
  Atualmente, apenas verifica se o ambiente é de desenvolvimento e chama o console correspondente.
  Em produção, não faz nada.
*/

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
