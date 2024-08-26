const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
const { status } = require("express/lib/response");
const { uploadImage } = require("../utilities/cloudinary");

module.exports = {
  // GET User account table data
  async getDisputes(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const data = await prisma.dispute.findMany({
          include: {
            user_account: true,
          },
        });
        res.status(200).json({
          data,
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

  // GET Active dispute data by user Id
  async getActiveDispute(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findMany({
          where: {
            useraccount_id: Number(useraccount_id),
            status: "active",
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

  // GET Closed dispute data by user Id
  async getClosedDispute(req, res) {
    try {
      const { useraccount_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(useraccount_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findMany({
          where: {
            useraccount_id: Number(useraccount_id),
            status: "closed",
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

  // GET each dispute all complains data by dispute Id
  async getDisputeComplains(req, res) {
    try {
      const { dispute_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(dispute_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.dispute.findFirst({
          where: {
            dispute_id: Number(dispute_id),
          },
          include: {
            dispute_complains: true,
            user_account: true,
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
  // POST Add New dispute by User
  async addDispute(req, res) {
    try {
      const { useraccount_id, complain_title, complain_msg, complain_img } =
        req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(useraccount_id.toString()) ||
          validator.isEmpty(complain_title) ||
          validator.isEmpty(complain_msg)
        )
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const imgUrl = await uploadImage(complain_img);
        const data = await prisma.dispute.create({
          data: {
            useraccount_id,
            complain_title,
            complain_msg,
            complain_img: imgUrl,
          },
        });
        res.status(200).json({
          status: 200,
          message: "Dispute Submit Successfully",
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

  // POST Add dispute Complains by User both user's
  async addDisputeComplains(req, res) {
    try {
      const { dispute_id, useraccount_id, complain_msg, img } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(useraccount_id.toString()) ||
          validator.isEmpty(dispute_id.toString()) ||
          validator.isEmpty(complain_msg)
        )
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const imgUrl = await uploadImage(img);
        const data = await prisma.dispute_complains.create({
          data: {
            useraccount_id,
            dispute_id,
            complain_msg,
            image: imgUrl
          },
        });
        res.status(200).json({
          status: 200,
          message: "Complain Send Successfully",
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

  // PUT Update Status
  async updateDisputeStatus(req, res) {
    try {
      const { id, status } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(id.toString()) ||
          validator.isEmpty(status.toString())
        )
          return res.status(400).send({ data: "Please provide all fields " });
        try {
          const dispute = await prisma.dispute.update({
            where: {
              dispute_id: Number(id),
            },
            data: {
              status,
            },
          });
          return res.status(200).json({
            status: 200,
            message: "Status Update Successfully",
            data: dispute,
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: "Form data does not exist!" });
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
  // DELETE Dispute
  async deleteDispute(req, res) {
    try {
      const { dispute_id } = req.query;
      if (validator.isEmpty(dispute_id.toString())) {
        return res.status(400).send({ message: "Please provide all fields" });
      }
      await prisma.dispute.delete({
        where: {
          dispute_id: Number(dispute_id),
        },
      });
      res.status(200).json({
        status: 200,
        message: "Data Delete Successfully",
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
};
