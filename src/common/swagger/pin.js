const pinSwagger = {
  "/pins": {
    get: {
      tags: ["Pins"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Nếu không truyền thì mặc định là 1",
        },
        {
          name: "pageSize",
          in: "query",
          description: "Nếu không truyền thì mặc định là 3",
        },
        {
          name: "search",
          in: "query",
          description: "",
        },
      ],
      responses: {
        200: { description: "oke" },
      },
    },
  },
};

export default pinSwagger;
