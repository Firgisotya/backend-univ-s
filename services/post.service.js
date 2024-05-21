const { prisma } = require("../models");

module.exports = {
  findAll: async () => {
    return await prisma.post.findMany({
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
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  findById: async (id) => {
    id = parseInt(id);
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true,
            university: true,
          },
        },
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  findByUser: async (id) => {
    return await prisma.post.findMany({
      where: { userId: parseInt(id) },
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
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  store: async (data) => {
    return await prisma.post.create({ data });
  },
  destroy: async (id) => {
    id = parseInt(id);
    await prisma.comment.deleteMany({ where: { postId: id } });
    return await prisma.post.delete({ where: { id } });
  },
  filterByDesc: async (req) => {
    return await prisma.post.findMany({
      where: { description: { contains: req } },
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
        comments: {
          select: {
            id: true,
            description: true,
            user: {
              select: {
                name: true,
                username: true,
                image: true,
                university: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
};
