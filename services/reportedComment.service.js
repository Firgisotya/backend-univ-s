const { prisma } = require("../models");

module.exports = {
  store: async (data) => {
    return await prisma.reportedComment.create({ data });
  },
  findUnique: async (userId, commentId) => {
    return await prisma.reportedComment.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(userId),
          commentId: parseInt(commentId),
        },
      },
    });
  },
};
