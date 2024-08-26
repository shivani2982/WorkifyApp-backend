const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const fcm = require('../helpers/fcm');

exports = module.exports = function (io) {
  io.sockets.on("connection", function (socket) {
    console.log("Connected");
    socket.on("join-room_and_send-message", async (data) => {
      console.log(data);
      const { userId1, userId2, msg_text, job_id } = data;

      // Check if a chatroom between the two users already exists
      let chatroom = await prisma.chatroom.findFirst({
        where: {
          AND: [
            { user_chatroom: { some: { useraccount_id: userId1 } } },
            { user_chatroom: { some: { useraccount_id: userId2 } } },
          ],
        },
      });

      if (!chatroom) {
        // Create a new chatroom
        chatroom = await prisma.chatroom.create({
          data: {
            job_id: job_id,
          },
        });

        // Create user_chatroom records
        await prisma.user_chatroom.createMany({
          data: [
            {
              useraccount_id: userId1,
              chatroom_id: chatroom.chatroom_id,
            },
            {
              useraccount_id: userId2,
              chatroom_id: chatroom.chatroom_id,
            },
          ],
        });
      }

      // Create a new message
      const newMessage = await prisma.message.create({
        data: {
          useraccount_id: userId1,
          chatroom_id: chatroom.chatroom_id,
          msg_text: msg_text,
        },
        include: {
          user_account: true,
        },
      });

      // Emit the message to both users in the chatroom
      io.emit("message", newMessage); 
    });

    socket.on("join-room", async (data) => {
      console.log("working join-room");
      const { userId1, userId2 } = data;

      // Find the chatroom
      const chatroom = await prisma.chatroom.findFirst({
        where: {
          OR: [
            {
              AND: [
                { user_chatroom: { some: { useraccount_id: userId1 } } },
                { user_chatroom: { some: { useraccount_id: userId2 } } },
              ],
            },
            {
              AND: [
                { user_chatroom: { some: { useraccount_id: userId2 } } },
                { user_chatroom: { some: { useraccount_id: userId1 } } },
              ],
            },
          ],
        },
      });

      if (chatroom) {
        socket.join(chatroom.chatroom_id);
      }
    });

    socket.on("send-message", async (data) => {
      console.log("working send-message");
      const { user, chatroom_id, msg_text } = data;

      // Create a new message
      const newMessage = await prisma.message.create({
        data: {
          useraccount_id: user,
          chatroom_id: Number(chatroom_id),
          msg_text: msg_text,
        },
        include: {
          user_account: true,
        },
      });
    //   console.log("ds", typeof chatroom_id.toString());
    //   console.log("ss", typeof String(chatroom_id));

      //   const chatroomForPushNot = await prisma.chatroom.findUnique({
      //     where: {
      //       chatroom_id: chatroom_id,
      //     },
      //     include: {
      //       user_chatroom: {
      //         where: {
      //           NOT: {
      //             useraccount_id: user,
      //           },
      //         },
      //         select: {
      //           user_account: true,
      //         },
      //       },
      //     },
      //   });

      //   const deviceToken =
      //     chatroomForPushNot.user_chatroom[0].user_account.deviceToken;

      // if (deviceToken) fcm.sendNotification(message, [deviceToken]);
      io.emit("message", newMessage);
    });

    socket.on("typing", async () => {
      console.log("working typing");
      io.emit("typing", "typing");
    });
	socket.on("disconnect", () => {
		socket.disconnect()
	})
  });
};
