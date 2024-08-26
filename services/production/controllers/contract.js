const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
const { uploadImage } = require("../utilities/cloudinary");

module.exports = {
  async getContracts(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const data = await prisma.contract.findMany({
          include: {
            proposal: {
              include: {
                user_account: true,
                payment: true,
                job: {
                  include: {
                    freelancer: {
                      include: {
                        user_account: true,
                      },
                    },
                    client: {
                      include: {
                        user_account: true,
                      },
                    },
                  },
                },
              },
            },
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

  async getCancelContracts(req, res) {
    try {
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const data = await prisma.contract.findMany({
          where: {
            OR: [
              { contract_status: "cancel request" },
              { contract_status: "order cancel" },
            ],
          },
          include: {
            proposal: {
              include: {
                user_account: true,
                payment: true,
                job: {
                  include: {
                    freelancer: {
                      include: {
                        user_account: true,
                      },
                    },
                    client: {
                      include: {
                        user_account: true,
                      },
                    },
                  },
                },
              },
            },
            cancel_contract: true,
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

  async getContractById(req, res) {
    try {
      const { contract_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(contract_id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const data = await prisma.contract.findUnique({
          where: {
            contract_id: parseInt(contract_id),
          },
          include: {
            proposal: {
              include: {
                user_account: true,
                payment: true,
                has_proposal_task: {
                  include: {
                    task: true,
                  },
                },
                job: {
                  include: {
                    task: true,
                    freelancer: {
                      include: {
                        user_account: true,
                      },
                    },
                    client: {
                      include: {
                        user_account: true,
                      },
                    },
                    skill_category: true,
                    saved_post: true,
                    payment: true,
                  },
                },
              },
            },
            cancel_contract: {
              include: {
                user_account: true,
              },
            },
          },
        });
        const transformedData = {
          ...data,
          proposal: {
            ...data.proposal,
            job: {
              ...data.proposal.job,
              skill_name: data.proposal?.job?.skill_category?.skill_name,
              skill_category: undefined,
              payment_amount: data.proposal?.job?.payment?.payment_amount,
              payment: undefined,

              freelancer: {
                freelancer_id: data.proposal?.job?.freelancer?.freelancer_id,
                user_id: data.proposal?.job?.freelancer?.user_account?.user_id,
                first_name:
                  data.proposal?.job?.freelancer?.user_account?.first_name,
                last_name:
                  data.proposal?.job?.freelancer?.user_account?.last_name,
                image: data.proposal?.job?.freelancer?.user_account?.image,
              },
              client: {
                client_id: data.proposal?.job?.client?.client_id,
                user_id: data.proposal?.job?.client?.user_account?.user_id,
                first_name:
                  data.proposal?.job?.client?.user_account?.first_name,
                last_name: data.proposal?.job?.client?.user_account?.last_name,
                image: data.proposal?.job?.client?.user_account?.image,
              },
              saved_post: {
                savedPost_status: data.proposal?.job?.saved_post[0]?.status,
              },
            },
          },
        };
        res.status(200).json({
          status: 200,
          data: transformedData,
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

  // GET
  async getContractsByProposalIds(req, res) {
    try {
      const { proposalIds } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const contracts = await prisma.contract.findMany({
          where: {
            proposal_id: {
              in: proposalIds,
            },
          },
          include: {
            proposal: {
              include: {
                user_account: true,
                payment: true,
                has_proposal_task: {
                  include: {
                    task: true,
                  },
                },
                job: {
                  include: {
                    task: true,
                  },
                },
              },
            },
          },
        });
        res.status(200).json({
          status: 200,
          data: contracts,
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
  // POST Cancel Contract by user and update the status cancel request
  async addCancelContract(req, res) {
    try {
      const { contract_id, user_id, message, img } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(user_id.toString()) ||
          validator.isEmpty(contract_id.toString()) ||
          validator.isEmpty(message)
        )
          return res.status(400).send({ message: "Please provide all fields" });
        const checkStatus = await prisma.contract.findUnique({
          where: {
            contract_id,
          },
        });
        const imgUrl = await uploadImage(img);
        if (checkStatus.contract_status === "working") {
          await prisma.contract.update({
            where: {
              contract_id,
            },
            data: {
              contract_status: "cancel request",
            },
          });

          const data = await prisma.cancel_contract.create({
            data: {
              contract_id,
              user_id,
              message,
              image: imgUrl,
            },
          });
          res.status(200).json({
            status: 200,
            message: "Cancel Request Send Successfully",
            data: data,
          });
        } else {
          const data = await prisma.cancel_contract.create({
            data: {
              contract_id,
              user_id,
              message,
              image: imgUrl,
            },
          });
          res.status(200).json({
            status: 200,
            message: "Cancel Request Send Successfully",
            data: data,
          });
        }
      } else {
        return res
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // PUT Update Cancel Contract Status
  async updateCancelContractStatus(req, res) {
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
          const contract = await prisma.contract.update({
            where: {
              contract_id: Number(id),
            },
            data: {
              contract_status: status,
            },
          });
          if (contract?.contract_status === "order cancel") {
            const tasks = await prisma.task.findMany({
              where: {
                has_proposal_task: {
                  some: {
                    proposal_id: parseInt(contract?.proposal_id),
                  },
                },
              },
              include: {
                has_proposal_task: true,
              },
            });
            const taskUpdates = tasks.map((task) => ({
              where: {
                task_id: task.task_id,
              },
              data: {
                status: "none",
              },
            }));

            await prisma.$transaction(
              taskUpdates.map((update) => prisma.task.update(update))
            );
          }
          return res.status(200).json({
            status: 200,
            message: "Status Update Successfully",
            data: contract,
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: " data does not exist!" });
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

   // PUT Update Cancel Contract Status
   async updateCompleteContractStatus(req, res) {
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
          const contract = await prisma.contract.update({
            where: {
              contract_id: Number(id),
            },
            data: {
              contract_status: status,
            },
          });
          if (contract?.contract_status === "complete") {
            const tasks = await prisma.task.findMany({
              where: {
                has_proposal_task: {
                  some: {
                    proposal_id: parseInt(contract?.proposal_id),
                  },
                },
              },
              include: {
                has_proposal_task: true,
              },
            });
            const taskUpdates = tasks.map((task) => ({
              where: {
                task_id: task.task_id,
              },
              data: {
                status: "complete",
              },
            }));

            await prisma.$transaction(
              taskUpdates.map((update) => prisma.task.update(update))
            );
          }
          return res.status(200).json({
            status: 200,
            message: "Status Update Successfully",
            data: contract,
          });
        } catch (error) {
          if (error.code === "P2025") {
            return res.status(400).send({ data: " data does not exist!" });
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
