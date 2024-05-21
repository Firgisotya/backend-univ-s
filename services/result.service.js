const { prisma } = require("../models");
const { store } = require("./comment.service");

module.exports = {
  findAll: async (id) => {
    return await prisma.result.findMany({
      where: { userId: parseInt(id) },
    });
  },
  store: async (data) => {
    return await prisma.result.create({ data });
  },
  findById: async (id) => {
    return await prisma.result.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
        exam: {
          select: {
            title: true,
            category: true,
          },
        },
      },
    });
  },
};
