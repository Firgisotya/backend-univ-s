const { successResponse, errorResponse } = require("../utils/Response");
const {
  findAll,
  findById,
  filterByTitle,
  store,
} = require("../services/exam.service");
const {
  store: storeResult,
  findById: findResult,
} = require("../services/result.service");
const {
  store: storeExamDetails,
  findById: findExamDetails,
} = require("../services/examDetails.service");
const { verifyToken } = require("../utils/processToken");
module.exports = {
  index: async (req, res) => {
    try {
      const { title } = req.query;
      let exams;
      if (title) {
        exams = await filterByTitle(title);
      } else {
        exams = await findAll();
      }
      return successResponse(
        res,
        200,
        exams,
        "Successfully retrieved all exams"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const exam = await findById(id);
      if (exam) {
        return successResponse(res, 200, exam, "Successfully retrieved exam");
      }
      return errorResponse(res, 404, "Exam not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      const { title, imageUrl, category, examDetails } = req.body;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      const exam = await store({
        title,
        imageUrl,
        category,
        userId: req.user.id,
      });
      let examDetailsData = [];
      examDetails.forEach((detail) => {
        examDetailsData.push({
          ...detail,
          examId: exam.id,
        });
      });
      await storeExamDetails(examDetailsData);
      return successResponse(res, 200, exam, "Successfully created exam");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  submit: async (req, res) => {
    try {
      const { authorization } = req.headers;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      const { examResponses } = req.body;

      let score = 0;
      let correct = 0;
      let wrong = 0;

      await Promise.all(
        examResponses.map(async (response) => {
          const examDetails = await findExamDetails(response.examDetailsId);
          if (examDetails) {
            if (response.answer === examDetails.key) {
              correct = correct + 1;
            } else {
              wrong = wrong + 1;
            }
          }
        })
      );
      score = (correct / examResponses.length) * 100;
      const result = await storeResult({
        userId: req.user.id,
        score,
        correct,
        wrong,
        examId: req.body.examId,
      });
      const finalResult = await findResult(result.id);
      return successResponse(
        res,
        200,
        finalResult,
        "Successfully submitted exam"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
