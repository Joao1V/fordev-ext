type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

const logStyles: Record<LogLevel, string> = {
   info: 'color: #51a2ff; font-weight: bold;',
   warn: 'color: orange; font-weight: bold;',
   error: 'color: red; font-weight: bold;',
   success: 'color: green; font-weight: bold;',
   debug: 'color: gray; font-weight: bold;',
};

function formatTimestamp(date: Date): string {
   const pad = (n: number) => n.toString().padStart(2, '0');
   return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function createLoggerMethod(level: LogLevel) {
   return (action: string, payload: any) => {
      const style = logStyles[level];
      const timestamp = formatTimestamp(new Date());

      console.log(
         `%c[${level.toUpperCase()}]\n\n%c[ACTION] %c${action} \n\n\n%c${timestamp}`,
         style,
         'color: #7ccf00; font-weight: bold; ',
         'font-weight: bold; color: #d1d5dc; ',
         'color: gray; font-style: italic;',
      );

      console.log(payload);
   };
}

interface LoggerFn {
   (action: string, payload: any): void;

   info: (action: string, payload: any) => void;
   warn: (action: string, payload: any) => void;
   error: (action: string, payload: any) => void;
   success: (action: string, payload: any) => void;
   debug: (action: string, payload: any) => void;
}

const logger = ((action: string, payload: any) => {
   logger.info(action, payload);
}) as LoggerFn;

logger.info = createLoggerMethod('info');
logger.warn = createLoggerMethod('warn');
logger.error = createLoggerMethod('error');
logger.success = createLoggerMethod('success');
logger.debug = createLoggerMethod('debug');

export { logger };
