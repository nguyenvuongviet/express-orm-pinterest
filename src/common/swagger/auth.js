const authSwagger = {
  "/auth/login": {
    post: {
      tags: ["Auth"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", example: "example@gmail.com" },
                password: { type: "string", example: "123456" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "oke" },
      },
    },
  },

  "/auth/register": {
    post: {
      tags: ["Auth"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", example: "example@gmail.com" },
                password: { type: "string", example: "123456" },
                fullName: { type: "string", example: "Nguyen Van A" },
                age: { type: "number", example: 20 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "oke" },
      },
    },
  },
};

export default authSwagger;
