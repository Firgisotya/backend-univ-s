const { prisma } = require("../models");

module.exports = {
  store: async (data) => {
    return await prisma.examDetails.createMany({ data });
  },
  findById: async (id) => {
    return await prisma.examDetails.findUnique({
      where: { id: parseInt(id) },
    });
  },
};
