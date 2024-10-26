import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptMe API",
      version: "1.0.0",
      description: "API documentation for AdoptMe project",
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

const swaggerRouter = Router();
swaggerRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

export default swaggerRouter;
