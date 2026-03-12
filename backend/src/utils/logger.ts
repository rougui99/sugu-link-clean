export const logInfo = (message: string): void => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
};

export const logError = (message: string | Error): void => {
  const msg = message instanceof Error ? message.message : message;
  console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`);
};
