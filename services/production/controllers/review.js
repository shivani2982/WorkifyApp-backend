const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET Review account table data
  async getReviews(req, res) {
    try {
      const data = await prisma.review.findMany({});
      res.status(200).json({
        data: data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET Review by given sendUserId & job id
  async getReviewWithUserIdAndJobId(req, res) {
    try {
      const { job_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        const decoded = await verifyToken(token.split(" ")[1]);
        const userId = decoded.user.id;
        if (validator.isEmpty(job_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.review.findFirst({
          where: {
            AND: [
              { send_review_userId: Number(userId) },
              { job_id: Number(job_id) },
            ],
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET Send User Review
  async getSendUserReview(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        const decoded = await verifyToken(token.split(" ")[1]);
        const userId = decoded.user.id;

        const data = await prisma.review.findMany({
          where: {
            send_review_userId: Number(userId),
          },
          include: {
            receivedReview_user: true,
            job: {
              include: {
                skill_category: true,
              },
            },
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET Send User Review
  async getRecivedUserReview(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        const decoded = await verifyToken(token.split(" ")[1]);
        const userId = decoded.user.id;
        const data = await prisma.review.findMany({
          where: {
            received_review_userId: Number(userId),
          },
          include: {
            sendReview_user: true,
            job: {
              include: {
                skill_category: true,
              },
            },
          },
        });
        res.status(200).json({
          status: 200,
          data: data,
        });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // ADD USER POST
  async addReview(req, res) {
    try {
      const {
        send_review_userId,
        received_review_userId,
        job_id,
        rating,
        review_comment,
      } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(review_comment) ||
          validator.isEmpty(send_review_userId.toString()) ||
          validator.isEmpty(received_review_userId.toString()) ||
          validator.isEmpty(job_id.toString()) ||
          validator.isEmpty(rating.toString())
        ) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const data = await prisma.review.create({
          data: {
            send_review_userId,
            received_review_userId,
            job_id,
            rating,
            review_comment,
          },
        });

        return res
          .status(200)
          .json({ status: 200, data, message: "Review send successfully!!!" });
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // // PUT Update both users info
  // async updateUser(req, res) {
  //   try {
  //     const { user_id, image, userData } = req.body;
  //     let token = req.headers["authorization"];

  //     if (token) {
  //       token = await verifyToken(token.split(" ")[1]);
  //       if (validator.isEmpty(user_id.toString()) || validator.isEmpty(image)) {
  //         return res.status(400).send({ message: "Please provide all fields" });
  //       }

  //       const existsUser = await prisma.user_account.findUnique({
  //         where: { user_id: user_id },
  //         include: {
  //           role: true,
  //         },
  //       });

  //       if (existsUser) {
  //         if (existsUser.role.name === "freelancer") {
  //           const {
  //             overview,
  //             experience,
  //             provider,
  //             description,
  //             links,
  //             location,
  //           } = userData;

  //           const id = await prisma.freelancer.findFirst({
  //             where: {
  //               useraccount_id: user_id,
  //             },
  //           });

  //           const freelancerData = await prisma.freelancer.update({
  //             where: {
  //               freelancer_id: Number(id.freelancer_id),
  //             },
  //             data: {
  //               overview,
  //               experience,
  //               provider,
  //               description,
  //               links,
  //               location,
  //             },
  //           });
  //           await prisma.user_account.update({
  //             where: { user_id: existsUser.user_id },
  //             data: {
  //               image, // assuming 'image' is the Base64-encoded image string
  //             },
  //           });

  //           res.status(200).json({
  //             status: 200,
  //             message: "Data update successfully in freelancer user",
  //             data: freelancerData,
  //           });
  //         } else if (existsUser.role.name === "client") {
  //           const { overview, location } = userData;

  //           const id = await prisma.client.findFirst({
  //             where: {
  //               useraccount_id: user_id,
  //             },
  //           });

  //           const clientData = await prisma.client.update({
  //             where: {
  //               client_id: Number(id.client_id),
  //             },
  //             data: {
  //               overview,
  //               location,
  //             },
  //           });

  //           await prisma.user_account.update({
  //             where: { user_id: existsUser.user_id },
  //             data: {
  //               image, // assuming 'image' is the Base64-encoded image string
  //             },
  //           });

  //           res.status(200).json({
  //             status: 200,
  //             message: "Data update successfully in client user",
  //             data: clientData,
  //           });
  //         }
  //       } else {
  //         return res
  //           .status(404)
  //           .send({ status: 404, message: "User is not found!!!" });
  //       }
  //     } else {
  //       return res
  //         .status(401)
  //         .send({ status: 401, data: "Please provide a valid auth token" });
  //     }
  //   } catch (e) {
  //     return res.status(500).json({ status: 500, message: e.message });
  //   }
  // },

  // // DELETE User
  // async deleteUser(req, res) {
  //   try {
  //     const { user_id } = req.query;
  //     if (validator.isEmpty(user_id.toString())) {
  //       return res.status(400).send({ message: "Please provide all fields" });
  //     }
  //     await prisma.user_account.delete({
  //       where: {
  //         user_id: Number(user_id),
  //       },
  //     });
  //     res.status(200).json({
  //       message: "Data Delete Successfully",
  //     });
  //   } catch (e) {
  //     return res.status(500).json({ status: 500, message: e.message });
  //   }
  // },
};
