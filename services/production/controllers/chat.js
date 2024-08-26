const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
// const { Server } = require("socket.io");
// const io = new Server(server);
module.exports = {
  async addChatroom(req, res) {
    try {
      const { job_id } = req.body;
      const chatrooms = await prisma.chatroom.create({
        data: {
          job_id,
        },
      });
      res.status(200).json({
        status: 200,
        data: chatrooms,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async addUserChatroom(req, res) {
    try {
      const { chatroom_id, useraccount_id } = req.body;
      const chatrooms = await prisma.user_chatroom.create({
        data: {
          chatroom_id,
          useraccount_id,
        },
      });
      res.status(200).json({
        status: 200,
        data: chatrooms,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async addMessage(req, res) {
    try {
      const { chatroom_id, useraccount_id, msg_text } = req.body;
      const message = await prisma.message.create({
        data: {
          chatroom_id,
          useraccount_id,
          msg_text,
        },
      });
      res.status(200).json({
        status: 200,
        data: message,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async getChatrooms(req, res) {
    try {
      let authToken = req.headers["authorization"];
      if (authToken) {
        const tokenData = await verifyToken(authToken.split(" ")[1]);
        const userId = tokenData.user.id;

        const userChatrooms = await prisma.user_chatroom.findMany({
          where: {
            chatroom_id: {
              in: await prisma.user_chatroom
                .findMany({
                  where: {
                    useraccount_id: Number(userId),
                  },
                  select: {
                    chatroom_id: true,
                  },
                })
                .then((res) => res.map((item) => item.chatroom_id)),
            },
            useraccount_id: {
              not: Number(userId),
            },
          },
          select: {
            chatroom_id: true,
            useraccount_id: true,
            user_account: true,
            chatroom: {
              select: {
                chatroom_id: true,
                job_id: true,
                created_at: true,
                updated_at: true,
                job: {
                  select: {
                    job_id: true,
                    job_description: true,
                    duration: true,
                    image: true,
                    created_at: true,
                    updated_at: true,
                    freelancer_id: true,
                    client_id: true,
                    task: true,
                    skill_category: true,
                    payment: true,
                    feature_job: true
                  },
                },
              },
            },
          },
        });

        res.status(200).json({
          status: 200,
          data: userChatrooms,
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

  async getMessages(req, res) {
    try {
      const { chatroom_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        if (!chatroom_id || isNaN(parseInt(chatroom_id))) {
          return res
            .status(400)
            .send({ message: "Please provide a valid chatroom_id" });
        }

        const messages = await prisma.message.findMany({
          where: {
            chatroom_id: parseInt(chatroom_id),
          },
          include: {
            user_account: true,
            chatroom: true,
          },
        });

        res.status(200).json({
          status: 200,
          data: messages,
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

  // POST Chatroom data
  //   async addChatroom(req, res) {
  //     try {
  //       const { client_id, freelancer_id, job_id } = req.body;
  //       let token = req.headers["authorization"];
  //       if (token) {
  //         token = await verifyToken(token.split(" ")[1]);
  //         if (
  //           validator.isEmpty(client_id.toString()) ||
  //           validator.isEmpty(freelancer_id.toString()) ||
  //           validator.isEmpty(job_id.toString())
  //         )
  //           return res
  //             .status(400)
  //             .send({ message: "Please provide all fields " });
  //         const chatroom = await prisma.chatroom.create({
  //           data: {
  //             client_id,
  //             freelancer_id,
  //             job_id,
  //           },
  //           include: {
  //             client: true,
  //             freelancer: true,
  //             job: true,
  //           },
  //         });
  //         res.status(200).json({
  //           status: 200,
  //           data: chatroom,
  //         });
  //       } else {
  //         return res
  //           .status(401)
  //           .send({ status: 401, data: "Please provide a valid auth token" });
  //       }
  //     } catch (e) {
  //       return res.status(500).json({ status: 500, message: e.message });
  //     }
  //   },

  //   POST message
  //   async addMessage(req, res, io) {
  //     try {
  //       const { freelancer_id, client_id, chatroom_id, msg_text } = req.body;
  //       let token = req.headers["authorization"];
  //       if (token) {
  //         token = await verifyToken(token.split(" ")[1]);
  //         if (
  //           validator.isEmpty(client_id.toString()) ||
  //           validator.isEmpty(freelancer_id.toString()) ||
  //           validator.isEmpty(chatroom_id.toString()) ||
  //           validator.isEmpty(msg_text)
  //         )
  //           return res
  //             .status(400)
  //             .send({ message: "Please provide all fields " });
  //         const message = await prisma.message.create({
  //           data: {
  //             freelancer_id,
  //             client_id,
  //             chatroom_id,
  //             msg_text,
  //           },
  //           include: {
  //             client: true,
  //             freelancer: true,
  //             chatroom: true,
  //           },
  //         });

  //         // Emit new message to all connected clients in the chatroom
  //         io.to(`chatroom-${chatroom_id}`).emit("newMessage", message);

  //         res.json(message);
  //       } else {
  //         return res
  //           .status(401)
  //           .send({ status: 401, data: "Please provide a valid auth token" });
  //       }
  //     } catch (e) {
  //       return res.status(500).json({ status: 500, message: e.message });
  //     }
  //   },
};
