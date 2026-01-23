const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

const isProd = process.env.NODE_ENV === 'production';
const version = process.env.NEXT_PUBLIC_ASSET_VERSION || 'unknown';
const currentLogLevel = isProd ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

const logger = {
  debug: (...args: any[]) =>
    currentLogLevel <= LOG_LEVELS.DEBUG && console.log('🔍', ...args),
  info: (...args: any[]) =>
    currentLogLevel <= LOG_LEVELS.INFO && console.info('ℹ️', ...args),
  warn: (...args: any[]) =>
    currentLogLevel <= LOG_LEVELS.WARN && console.warn('⚠️', ...args),
  error: (...args: any[]) => console.error('❌', ...args),
};

logger.debug('Версия ассетов:', version);

export default logger;
