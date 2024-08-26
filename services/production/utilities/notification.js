const admin = require("firebase-admin");
// Path to your service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function notify(message, detailData) {
  try {
    const response = await admin.messaging().send(message);
    console.log(message.notification);
    console.log(detailData.user_id);
    await prisma.notification.create({
      data: {
        title: message.notification.title,
        body: message.notification.body,

        user_id: detailData.user_id,
        proposal_id: detailData.proposal_id,
        contract_id: detailData.contract_id,
        chatroom_id: detailData.chatroom_id,
      },
    });
    console.log("Message sent successfully:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = { notify };
