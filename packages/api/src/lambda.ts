import serverlessExpress from '@vendia/serverless-express';
import app from './index.js'; // Add .js extension for ESM import

// @ts-expect-error type definition is not correct
export const handler = serverlessExpress({ app });
