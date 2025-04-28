const authSSwagger = {
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
                        password: { type: "string", example: "1234" },
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

export default authSSwagger;
