const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");

module.exports = {
  // GET User account table data
  async getsavedPosts(req, res) {
    try {
      const data = await prisma.saved_post.findMany({});
      res.status(200).json({
        data: data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async getsavedPostsByUserId(req, res) {
    try {
      const { user_id } = req.query;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(user_id.toString()) || !user_id)
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const post = await prisma.saved_post.findMany({
          where: {
            useraccount_id: Number(user_id),
            status: true,
          },
          select: {
            id: true,
            status: true,
            useraccount_id: true,
            job: {
              select: {
                job_id: true,
                job_description: true,
                duration: true,
                image: true,
                updated_at: true,
                skill_category: {
                  select: {
                    skill_name: true,
                  },
                },
                saved_post: {
                  select: {
                    status: true,
                  },
                },
                freelancer: {
                  select: {
                    freelancer_id: true,
                    user_account: {
                      select: {
                        first_name: true,
                        last_name: true,
                        image: true,
                      },
                    },
                  },
                },
                client: {
                  select: {
                    client_id: true,
                    user_account: {
                      select: {
                        first_name: true,
                        last_name: true,
                        image: true,
                      },
                    },
                  },
                },
                payment: {
                  select: {
                    payment_amount: true,
                  },
                },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        });
        const transformedData = post.map((item) => ({
          id: item.id,
          status: item.status,
          useraccount_id: item.useraccount_id,
          job: {
            ...item.job,
            skill_name: item.job.skill_category?.skill_name,
            skill_category: undefined,
            payment_amount: item.job?.payment?.payment_amount,
            payment: undefined,
            freelancer: {
              freelancer_id: item.job?.freelancer?.freelancer_id,
              first_name: item.job?.freelancer?.user_account?.first_name,
              last_name: item.job?.freelancer?.user_account?.last_name,
              image: item.job?.freelancer?.user_account?.image,
            },
            client: {
              client_id: item.job?.client?.client_id,
              first_name: item.job?.client?.user_account?.first_name,
              last_name: item.job?.client?.user_account?.last_name,
              image: item.job?.client?.user_account?.image,
            },
            saved_post: {
              savedPost_status: item.job?.saved_post[0]?.status,
            },
          },
        }));
        res.status(200).json({
          status: 200,
          data: transformedData,
        });
      } else {
        return resUser
          .status(401)
          .send({ status: 401, data: "Please provide a valid auth token" });
      }
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  async savedPost(req, res) {
    try {
      const { useraccount_id, status, job_id } = req.body;
      let token = req.headers["authorization"];
      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        const existsPost = await prisma.saved_post.findFirst({
          where: { useraccount_id, job_id },
        });

        if (existsPost) {
          const updatePost = await prisma.saved_post.update({
            where: {
              id: Number(existsPost?.id),
            },
            data: {
              status: Boolean(status),
            },
          });
          return res.status(200).send({
            status: 200,
            message: "Saved Post Update the status!!",
            data: updatePost,
          });
        } else {
          const data = await prisma.saved_post.create({
            data: {
              job_id,
              useraccount_id,
              status,
            },
          });
          return res.status(200).send({
            status: 200,
            message: "New Saved Post!!",
            data,
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
};
