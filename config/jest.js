jest.setTimeout(180000);

global.testing = {
  environment: () => environment,
  isBrowser: () => isBrowser,
  isBrowserLite: () => isBrowser && environment === 'browser-lite',
};
