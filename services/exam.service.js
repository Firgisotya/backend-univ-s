const { prisma } = require("../models");
const { store } = require("./comment.service");

module.exports = {
  findAll: async () => {
    return await prisma.exam.findMany({
      orderBy: { id: "desc" },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
      },
    });
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.exam.findUnique({
      where: { id },
      include: {
        examDetails: true,
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
      },
    });
  },
  filterByTitle: async (title) => {
    return await prisma.exam.findMany({
      orderBy: { id: "desc" },
      where: {
        title: {
          contains: title,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
      },
    });
  },
  store: async (data) => {
    return await prisma.exam.create({ data });
  },
  destroy: async (id) => {
    id = parseInt(id);
    return await prisma.exam.delete({ where: { id } });
  },
};
