import authSSwagger from "./auth";
import pinSwagger from "./pin";

const swaggerDocument = {
  openapi: "3.1.1",
  info: {
    title: "API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3069/api",
      description: "Local Server",
    },
    {
      url: "https://api.vercel.app",
      description: "Production Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...authSSwagger,
    ...pinSwagger,
  },
};

export default swaggerDocument;
