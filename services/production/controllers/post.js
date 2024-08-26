const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
const { uploadImage } = require("../utilities/cloudinary");

module.exports = {
  // GET all Job table data
  async getJobs(req, res) {
    try {
      const job = await prisma.job.findMany({});
      res.status(200).json({
        data: job,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET Job By Id
  async getJobById(req, res) {
    try {
      const { job_id } = req.query;
      if (validator.isEmpty(job_id.toString())) {
        return res.status(400).send({ message: "Please provide all fields" });
      }
      const data = await prisma.job.findUnique({
        where: {
          job_id: Number(job_id),
        },
        include: {
          payment: true,
          feature_job: true,
        },
      });
      res.status(200).json({
        status: 200,
        message: "Get Data Succesfully",
        data,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // GET Featured Post By status
  async getFeaturedPosts(req, res) {
    try {
      const { status } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(status.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }
        const data = await prisma.feature_job.findMany({
          where: {
            status: Boolean(status),
          },
          select: {
            feature_id: true,
            status: true,
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
            feature_id: "desc",
          },
        });
        const transformedData = data.map((item) => ({
          feature_id: item.feature_id,
          status: item.status,
          job: {
            ...item.job[0],
            skill_name: item.job[0]?.skill_category?.skill_name,
            skill_category: undefined,
            payment_amount: item.job[0]?.payment?.payment_amount,
            payment: undefined,

            freelancer: {
              freelancer_id: item.job[0]?.freelancer?.freelancer_id,
              first_name: item.job[0]?.freelancer?.user_account?.first_name,
              last_name: item.job[0]?.freelancer?.user_account?.last_name,
              image: item.job[0]?.freelancer?.user_account?.image,
            },
            client: {
              client_id: item.job[0]?.client?.client_id,
              first_name: item.job[0]?.client?.user_account?.first_name,
              last_name: item.job[0]?.client?.user_account?.last_name,
              image: item.job[0]?.client?.user_account?.image,
            },
            saved_post: {
              savedPost_status: item.job[0]?.saved_post[0]?.status,
            },
          },
        }));
        res.status(200).json({
          status: 200,
          message: "Get Data Succesfully",
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

  // GET Job's data with client id
  async getJobUsingUserId(req, res) {
    try {
      const { user_id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(user_id.toString()) || !user_id)
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const existsUser = await prisma.user_account.findUnique({
          where: {
            user_id: Number(user_id),
          },
          include: {
            role: true,
          },
        });
        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const freelancer = await prisma.freelancer.findFirst({
              where: {
                useraccount_id: Number(user_id),
              },
            });
            const post = await prisma.job.findMany({
              where: {
                freelancer_id: Number(freelancer.freelancer_id),
              },
              select: {
                job_id: true,
                job_description: true,
                duration: true,
                image: true,
                updated_at: true,
                client: {
                  select: {
                    client_id: true,
                    user_account: {
                      select: {
                        user_id: true,
                        first_name: true,
                        last_name: true,
                        image: true,
                      },
                    },
                  },
                },
                saved_post: {
                  select: {
                    status: true,
                  },
                },
                skill_category: {
                  select: {
                    skill_name: true,
                  },
                },
                feature_job: {
                  select: {
                    status: true,
                  },
                },
                payment: {
                  select: {
                    payment_amount: true,
                  },
                },
                task: {
                  select: {
                    task_description: true,
                    status: true,
                  },
                },
              },
            });
            const modifiedPosts = post.map((job) => ({
              ...job,
              skill_name: job.skill_category.skill_name,
              skill_category: undefined,
              payment_amount: job.payment?.payment_amount,
              payment: undefined,
              feature_job: job.feature_job?.status,
              saved_post: {
                savedPost_status: job?.saved_post[0]?.status,
              },
              user_id: job.client?.user_account?.user_id,
              first_name: job.client?.user_account?.first_name,
              last_name: job.client?.user_account?.last_name,
              profile_image: job.client?.user_account?.image,
              client: undefined,
            }));
            res.status(200).json({
              status: 200,
              data: modifiedPosts,
            });
          } else if (existsUser.role.name === "client") {
            const client = await prisma.client.findFirst({
              where: {
                useraccount_id: Number(user_id),
              },
            });
            const post = await prisma.job.findMany({
              where: {
                client_id: Number(client.client_id),
              },
              select: {
                job_id: true,
                job_description: true,
                duration: true,
                image: true,
                updated_at: true,
                client: {
                  select: {
                    client_id: true,
                    user_account: {
                      select: {
                        user_id: true,
                        first_name: true,
                        last_name: true,
                        image: true,
                      },
                    },
                  },
                },
                saved_post: {
                  select: {
                    status: true,
                  },
                },
                skill_category: {
                  select: {
                    skill_name: true,
                  },
                },
                feature_job: {
                  select: {
                    status: true,
                  },
                },
                payment: {
                  select: {
                    payment_amount: true,
                  },
                },
                task: {
                  select: {
                    task_id: true,
                    task_description: true,
                    status: true,
                  },
                },
              },
            });
            const modifiedPosts = post.map((job) => ({
              ...job,
              skill_name: job.skill_category.skill_name,
              skill_category: undefined,
              payment_amount: job.payment?.payment_amount,
              payment: undefined,
              feature_job: job.feature_job?.status,
              saved_post: {
                savedPost_status: job?.saved_post[0]?.status,
              },
              user_id: job.client?.user_account?.user_id,
              first_name: job.client?.user_account?.first_name,
              last_name: job.client?.user_account?.last_name,
              profile_image: job.client?.user_account?.image,
              client: undefined,
            }));
            res.status(200).json({
              status: 200,
              data: modifiedPosts,
            });
          }
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

  // GET Job's data with client id
  async getJobUsingClient(req, res) {
    try {
      const { client_id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(client_id.toString()) || !client_id)
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const post = await prisma.job.findMany({
          where: {
            client_id: Number(client_id),
          },
          select: {
            job_id: true,
            job_description: true,
            duration: true,
            image: true,
            updated_at: true,
            client: {
              select: {
                client_id: true,
                user_account: {
                  select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    image: true,
                  },
                },
              },
            },
            saved_post: {
              select: {
                status: true,
              },
            },
            skill_category: {
              select: {
                skill_name: true,
              },
            },
            feature_job: {
              select: {
                status: true,
              },
            },
            payment: {
              select: {
                payment_amount: true,
              },
            },
            task: {
              select: {
                task_description: true,
                status: true,
              },
            },
          },
        });
        const modifiedPosts = post.map((job) => ({
          ...job,
          skill_name: job.skill_category.skill_name,
          skill_category: undefined,
          payment_amount: job.payment?.payment_amount,
          payment: undefined,
          feature_job: job.feature_job?.status,
          saved_post: {
            savedPost_status: job?.saved_post[0]?.status,
          },
          user_id: job.client?.user_account?.user_id,
          first_name: job.client?.user_account?.first_name,
          last_name: job.client?.user_account?.last_name,
          profile_image: job.client?.user_account?.image,
          client: undefined,
        }));
        res.status(200).json({
          status: 200,
          data: modifiedPosts,
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

  // GET Job's data with freelancer id
  async getJobUsingFreelancer(req, res) {
    try {
      const { freelancer_id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(freelancer_id.toString()) || !freelancer_id)
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const post = await prisma.job.findMany({
          where: {
            freelancer_id: Number(freelancer_id),
          },
          select: {
            job_id: true,
            job_description: true,
            duration: true,
            image: true,
            updated_at: true,
            freelancer: {
              select: {
                freelancer_id: true,
                user_account: {
                  select: {
                    user_id: true,
                    first_name: true,
                    last_name: true,
                    image: true,
                  },
                },
              },
            },
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
            feature_job: {
              select: {
                status: true,
              },
            },
            payment: {
              select: {
                payment_amount: true,
              },
            },
            task: {
              select: {
                task_description: true,
                status: true,
              },
            },
          },
        });
        const modifiedPosts = post.map((job) => ({
          ...job,
          skill_name: job.skill_category.skill_name,
          skill_category: undefined,
          payment_amount: job.payment?.payment_amount,
          payment: undefined,
          feature_job: job.feature_job?.status,
          saved_post: {
            savedPost_status: job?.saved_post[0]?.status,
          },
          // skill_category: undefined,
          user_id: job.freelancer?.user_account?.user_id,
          first_name: job.freelancer?.user_account?.first_name,
          last_name: job.freelancer?.user_account?.last_name,
          profile_image: job.freelancer?.user_account?.image,
          freelancer: undefined,
        }));
        res.status(200).json({
          status: 200,
          data: modifiedPosts,
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

  //   Get all job of selected skills
  async getJobUsingSkills(req, res) {
    try {
      const { freelancer_id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(freelancer_id.toString()) || !freelancer_id)
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const freelancerSkillsData = await prisma.has_skill.findMany({
          where: {
            freelancer_id: Number(freelancer_id),
          },
          select: {
            skill_id: true,
          },
        });
        if (freelancerSkillsData && freelancerSkillsData.length > 0) {
          const freelancerSkills = freelancerSkillsData.map(
            (skill) => skill.skill_id
          );
          if (freelancerSkills) {
            const jobs = await prisma.job.findMany({
              where: {
                skillcategory_id: {
                  in: freelancerSkills,
                },
              },
              orderBy: {
                job_id: "desc",
              },
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
                        user_id: true,
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
                        user_id: true,
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
                task: {
                  select: {
                    task_description: true,
                    status: true,
                  },
                },
              },
            });
            const modifiedJobs = jobs.map((job) => ({
              ...job,
              skill_name: job.skill_category.skill_name,
              skill_category: undefined,
              saved_post: {
                savedPost_status: job?.saved_post[0]?.status,
              },
              client: {
                user_id: job.client?.user_account?.user_id,
                first_name: job.client?.user_account?.first_name,
                last_name: job.client?.user_account?.last_name,
                image: job.client?.user_account?.image,
              },
              freelancer: {
                user_id: job?.freelancer?.user_account?.user_id,
                first_name: job.freelancer?.user_account?.first_name,
                last_name: job.freelancer?.user_account?.last_name,
                image: job.freelancer?.user_account?.image,
              },
              payment_amount: job.payment?.payment_amount,
              payment: undefined,
            }));
            res.status(200).json({
              status: 200,
              data: modifiedJobs,
            });
          }
        } else {
          return res.status(404).json({
            status: 404,
            message: "No skills found for the freelancer.",
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

  // ADD USER POST
  async addJob(req, res) {
    try {
      const { user_id, postData, task_descriptions } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(user_id.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }
        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
          include: {
            role: true,
            freelancer: true,
            client: true,
          },
        });
        const freelancerId = existsUser.freelancer.map(
          (item) => item.freelancer_id
        );
        const clientId = existsUser.client.map((item) => item.client_id);

        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const {
              job_description,
              duration,
              image,
              payment,
              skillcategory_id,
              feature_job,
            } = postData;

            const imgUrl = await uploadImage(image);
            const freelancerPost = await prisma.job.create({
              data: {
                freelancer: {
                  connect: {
                    freelancer_id: Number(freelancerId),
                  },
                },
                job_description,
                duration,
                image: imgUrl,
                skill_category: {
                  connect: {
                    skill_id: Number(skillcategory_id),
                  },
                },
                payment: {
                  create: {
                    payment_amount: parseFloat(payment),
                  },
                },
                feature_job: {
                  create: {
                    status: Boolean(feature_job),
                  },
                },
              },
              include: {
                freelancer: true,
                skill_category: true,
                payment: true,
                feature_job: true,
              },
            });
            if (
              task_descriptions.length === 0 ||
              task_descriptions.every((description) => description === "")
            ) {
              res.status(200).json({
                status: 200,
                message: "Post published successfully",
                data: freelancerPost,
              });
            } else {
              const job_id = Number(freelancerPost.job_id);
              const tasks = await Promise.all(
                task_descriptions.map((description) => {
                  return prisma.task.create({
                    data: {
                      task_description: description,
                      job: {
                        connect: { job_id },
                      },
                    },
                    select: {
                      task_id: true,
                      task_description: true,
                      status: true,
                      job_id: true,
                      created_at: true,
                      updated_at: true,
                      job: {
                        include: {
                          freelancer: true,
                          skill_category: true,
                          payment: true,
                          feature_job: true,
                        },
                      },
                    },
                  });
                })
              );
              res.status(200).json({
                status: 200,
                message: "Post published successfully",
                data: tasks,
              });
            }
          } else if (existsUser.role.name === "client") {
            const {
              job_description,
              duration,
              image,
              payment,
              skillcategory_id,
              feature_job,
            } = postData;
            const imgUrl = await uploadImage(image);
            const clientPost = await prisma.job.create({
              data: {
                client: {
                  connect: {
                    client_id: Number(clientId),
                  },
                },
                job_description,
                duration,
                image: imgUrl,
                skill_category: {
                  connect: {
                    skill_id: Number(skillcategory_id),
                  },
                },
                payment: {
                  create: {
                    payment_amount: parseFloat(payment),
                  },
                },
                feature_job: {
                  create: {
                    status: Boolean(feature_job),
                  },
                },
              },
              include: {
                skill_category: true,
                payment: true,
                feature_job: true,
              },
            });
            if (
              task_descriptions.length === 0 ||
              task_descriptions.every((description) => description === "")
            ) {
              res.status(200).json({
                status: 200,
                message: "Post published successfully",
                data: clientPost,
              });
            } else {
              const job_id = Number(clientPost.job_id);
              const tasks = await Promise.all(
                task_descriptions.map((description) => {
                  return prisma.task.create({
                    data: {
                      task_description: description,
                      job: {
                        connect: { job_id },
                      },
                    },
                    select: {
                      task_id: true,
                      task_description: true,
                      status: true,
                      job_id: true,
                      created_at: true,
                      updated_at: true,
                      job: {
                        include: {
                          client: true,
                          skill_category: true,
                          payment: true,
                          feature_job: true,
                        },
                      },
                    },
                  });
                })
              );
              res.status(200).json({
                status: 200,
                message: "Post published successfully",
                data: tasks,
              });
            }
          }
        } else {
          return res
            .status(404)
            .send({ status: 404, message: " User is not found!!!" });
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

  // PUT Update Job info
  async updateJob(req, res) {
    try {
      const {
        job_id,
        job_description,
        duration,
        image,
        skillcategory_id,
        payment_id,
        payment_amount,
        feature_id,
        feature_job,
      } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(job_id.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }
        const imgUrl = await uploadImage(image);
        const jobData = await prisma.job.update({
          where: {
            job_id,
          },
          data: {
            job_description,
            duration,
            image: imgUrl,
            skill_category: {
              connect: {
                skill_id: skillcategory_id,
              },
            },
            payment: {
              connect: {
                payment_id: payment_id,
              },

              update: {
                payment_amount: payment_amount,
              },
            },
            feature_job: {
              connect: {
                feature_id: feature_id,
              },
              update: {
                status: Boolean(feature_job),
              },
            },
          },
          include: {
            skill_category: true,
            payment: true,
            feature_job: true,
          },
        });

        res.status(200).json({
          status: 200,
          message: "Data update successfully job post",
          data: jobData,
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

  // DELETE Job
  async deleteJob(req, res) {
    try {
      const { job_id } = req.query;
      if (validator.isEmpty(job_id.toString())) {
        return res.status(400).send({ message: "Please provide all fields" });
      }
      await prisma.job.delete({
        where: {
          job_id: Number(job_id),
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
