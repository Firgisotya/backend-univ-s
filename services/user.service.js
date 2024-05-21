const { prisma } = require("../models");

module.exports = {
  findAll: async () => {
    return await prisma.user.findMany();
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.user.findUnique({ where: { id } });
  },
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },
  findByUsername: async (username) => {
    return await prisma.user.findUnique({ where: { username } });
  },
  store: async (data) => {
    return await prisma.user.create({ data });
  },
  update: async (id, data) => {
    return await prisma.user.update({ where: { id }, data });
  },
  destroy: async (id) => {
    return await prisma.user.delete({ where: { id } });
  },
};
