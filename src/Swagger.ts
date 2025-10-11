import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Feedback API",
      version: "1.0.0",
      description:
        "API documentation for the Feedback system — includes endpoints for Bug Reports, Feature Requests, and General Feedback.",
      contact: {
        name: "Your Team Name",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
    security: [{ userHeader: [] }], // Change to [{ bearerAuth: [] }] if using JWT
  },

  // Where Swagger will look for annotations
  apis: [
    "./src/routes/*.ts", // if using TypeScript
    "./src/routes/*.js", // if compiled JS
  ],
});
