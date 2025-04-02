import serverless from 'serverless-http';
import app from './index.js'; // Add .js extension for ESM import

export const handler = serverless(app);
