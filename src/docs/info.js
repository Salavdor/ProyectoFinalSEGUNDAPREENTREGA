export const info = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Farmacia",
      version: "1.0.0",
      description: "API de farmacia",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./src/docs/*.yml"],
};
