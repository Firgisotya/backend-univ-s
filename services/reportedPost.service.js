const { prisma } = require("../models");
const { findUnique } = require("./reportedComment.service");

module.exports = {
  store: async (data) => {
    return await prisma.reportedPost.create({ data });
  },
  findUnique: async (userId, postId) => {
    return await prisma.reportedPost.findUnique({
      where: {
        userId_postId: {
          userId: parseInt(userId),
          postId: parseInt(postId),
        },
      },
    });
  },
};
