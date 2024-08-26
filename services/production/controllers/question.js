const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");

module.exports = {
  // GET
  async getQuestions(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const questions = await prisma.question.findMany({});
        return res.status(200).json({
          data: questions,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  //   get question table with form data
  async getQuestionWithForm(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const que = await prisma.question.findMany({
          include: {
            form: {select: {
              id: true,
              name: true
            }},
          },
        });
        return res.status(200).json({
          data: que,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  //   Get the questions with anwers
  async getQuestionWithAns(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const que = await prisma.question.findMany({
          include: {
            responses: {
              select: {
                id: true,
                answer: true,
              }
            },
          },
        });
        res.status(200).json({
          data: que,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET SINGLE Question
  async getSingleQuestion(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        if (!id || validator.isEmpty(id.toString()))
          return res.status(400).send({ data: "Please provide id" });
        const que = await prisma.question.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.status(200).json({
          data: que,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // POST
  async addQuestion(req, res) {
    try {
      const { question, required, error, placeholder, form_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(question) ||
          validator.isEmpty(required.toString()) ||
          validator.isEmpty(error) ||
          validator.isEmpty(placeholder) ||
          validator.isEmpty(form_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        const que = await prisma.question.create({
          data: {
            question,
            required,
            error,
            placeholder,
            form_id,
          },
        });
        return res
          .status(200)
          .json({ status: 200, message: "Data add successfully", data: que });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT
  async updateQuestion(req, res) {
    try {
      const { id, question, required, error, placeholder, form_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(id.toString()) ||
          validator.isEmpty(question) ||
          validator.isEmpty(required.toString()) ||
          validator.isEmpty(error) ||
          validator.isEmpty(placeholder) ||
          validator.isEmpty(form_id.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          const que = await prisma.question.update({
            where: {
              id: id,
            },
            data: {
              question,
              required,
              error,
              placeholder,
              form_id,
            },
          });
          return res.status(200).json({
            message: "Data Update Successfully",
            data: que,
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: "Data does not exist!" });
          }
          throw error;
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // DELETE
  async deleteQuestion(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        if (!id || validator.isEmpty(id.toString())) {
          return res.status(400).send({ data: "Please provide all fields" });
        }
        try {
          await prisma.question.delete({
            where: {
              id: Number(id),
            },
          });
          res.status(200).json({
            message: "Data Delete Successfully",
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res
              .status(400)
              .send({ data: "Data does not exist! OR aLready deleted!" });
          }
          throw error;
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
