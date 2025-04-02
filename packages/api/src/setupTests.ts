import { beforeAll, afterEach, afterAll } from 'vitest';
import { server as mswServer } from './__mocks__/server.js'; // MSW server

// Start the MSW server before all tests.
beforeAll(() => mswServer.listen({ onUnhandledRequest: 'bypass' }));

// Reset MSW handlers after each test.
afterEach(() => mswServer.resetHandlers());

// Close the MSW server after all tests are finished.
afterAll(() => mswServer.close());
