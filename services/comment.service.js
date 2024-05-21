const { prisma } = require("../models");

module.exports = {
  store: async (data) => {
    return await prisma.comment.create({ data });
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.comment.findUnique({ where: { id } });
  },
  destroy: async (id) => {
    id = parseInt(id);
    return await prisma.comment.delete({ where: { id } });
  },
};
