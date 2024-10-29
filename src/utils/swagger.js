import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptMe API",
      version: "1.0.0",
      description: "API documentation for AdoptMe project",
    },
  },
  apis: [`${__dirname}/../docs/**/*.yaml`],
};

export default swaggerOptions;
