export const demoService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    return `This action returns all demo`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} demo`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} demo`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} demo`;
  },
};
