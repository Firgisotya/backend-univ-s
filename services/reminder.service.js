const { prisma } = require("../models");

module.exports = {
  findAll: async (id) => {
    return await prisma.reminder.findMany({
      where: { userId: parseInt(id) },
      orderBy: { id: "desc" },
    });
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.reminder.findUnique({ where: { id } });
  },
  store: async (data) => {
    return await prisma.reminder.create({ data });
  },
  update: async (id, data) => {
    return await prisma.reminder.update({ where: { id }, data });
  },
  destroy: async (id) => {
    id = parseInt(id);
    return await prisma.reminder.delete({ where: { id } });
  },
};
