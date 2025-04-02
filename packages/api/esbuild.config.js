export default (serverless) => {
  return {
    /** Avoid error `Dynamic require of \"@codegenie/serverless-express\" is not supported",` */
    banner: {
      js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
    },
  };
};
