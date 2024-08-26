const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const generateToken = require("../utilities/generateToken");
const verifyToken = require("../utilities/verifyToken");
const validator = require("validator");
const crypto = require("crypto");
const { uploadImage } = require("../utilities/cloudinary");

module.exports = {
  // GET User account table data
  async getUsers(req, res) {
    try {
      const user_accounts = await prisma.user_account.findMany({
        include: {
          role: true,
        },
      });
      res.status(200).json({
        data: user_accounts,
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },
  // GET SINGLE User data
  async getUserById(req, res) {
    try {
      const { id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(id.toString()))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        const user = await prisma.user_account.findUnique({
          where: {
            user_id: Number(id),
          },
          include: {
            form: true
          }
        });
        res.status(200).json({
          status: 200,
          data: user,
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
  // GET SINGLE User data
  async getUser(req, res) {
    try {
      const { id, userType } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(id.toString()) || validator.isEmpty(userType))
          return res
            .status(400)
            .send({ message: "Please provide all fields " });
        // const user = await prisma.user_account.findFirst({
        //   where: {
        //     user_id: Number(user_id),
        //   },
        // });
        // res.status(200).json({
        //   status: 200,
        //   data: user,
        // });
        if (userType === "freelancer") {
          const user = await prisma.freelancer.findFirst({
            where: {
              freelancer_id: Number(id),
            },
            include: {
              user_account: true,
            },
          });
          res.status(200).json({
            status: 200,
            data: user,
          });
        } else if (userType === "client") {
          const user = await prisma.client.findFirst({
            where: {
              client_id: Number(id),
            },
            include: {
              user_account: true,
            },
          });
          res.status(200).json({
            status: 200,
            data: user,
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

  // LOGIN POST
  async login(req, res) {
    try {
      const { email, password, fcmToken } = req.body;
      if (validator.isEmpty(email) || validator.isEmpty(password))
        return res.status(400).send({ message: "Please provide all fields " });
      const userFound = await prisma.user_account.findFirst({
        where: {
          email: email,
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"),
        },
        include: {
          role: true,
        },
      });
      if (!userFound) {
        return res.status(404).send({
          status: 404,
          message: "User not found or Incorrect email or password!",
        });
      }
      await prisma.user_account.update({
        where: {
          user_id: parseInt(userFound.user_id),
        },
        data: {
          fcmToken,
        },
      });
      if (userFound.role.name == "freelancer") {
        const freelancerUser = await prisma.freelancer.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        return res.status(200).send({
          status: 200,
          data: generateToken(freelancerUser),
          message: "Freelancer",
        });
      } else if (userFound.role.name == "client") {
        const clientUser = await prisma.client.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        return res.status(200).send({
          status: 200,
          data: generateToken(clientUser),
          message: "Client",
        });
      } else if (userFound.role.name == "admin") {
        const user_account = {
          useraccount_id: userFound.user_id,
          user_account: userFound,
        };
        return res.status(200).send({
          status: 200,
          data: generateToken(user_account),
          message: "Admin",
        });
      }
      return res.status(500).json({ status: 500, message: "Invalid role" });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  //
  async getUserMe(req, res) {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const decoded = await verifyToken(token.split(" ")[1]);
      const userId = decoded.user.id;
      console.log(userId);

      const userFound = await prisma.user_account.findUnique({
        where: {
          user_id: Number(userId),
        },
        include: {
          role: true,
        },
      });
      if (!userFound) {
        return res.status(404).send({
          status: 404,
          message: "User not found or Incorrect email or password!",
        });
      }

      if (userFound.role.name == "freelancer") {
        const freelancerUser = await prisma.freelancer.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        console.log(freelancerUser);
        return res.status(200).send({
          status: 200,
          data: generateToken(freelancerUser),
          message: "Freelancer",
        });
      } else if (userFound.role.name == "client") {
        const clientUser = await prisma.client.findFirst({
          where: {
            useraccount_id: userFound.user_id,
          },
          include: {
            user_account: true,
          },
        });
        return res.status(200).send({
          status: 200,
          data: generateToken(clientUser),
          message: "Client",
        });
      } else if (userFound.role.name == "admin") {
        return res.status(200).send({
          status: 200,
          data: generateToken(userFound),
          message: "Admin",
        });
      }
      return res.status(400).json({ status: 400, message: "Invalid role" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST user data
  async signUp(req, res) {
    try {
      const {
        user_name,
        email,
        password,
        first_name,
        last_name,
        gender,
        role_id,
      } = req.body;
      if (
        validator.isEmpty(user_name) ||
        validator.isEmpty(email) ||
        validator.isEmpty(password) ||
        validator.isEmpty(first_name) ||
        validator.isEmpty(last_name) ||
        validator.isEmpty(gender) ||
        validator.isEmpty(role_id.toString())
      )
        return res.status(400).send({ message: "Please provide all fields " });

      const existsUserName = await prisma.user_account.findUnique({
        where: { user_name: user_name },
      });
      if (existsUserName)
        return res
          .status(409)
          .send({ message: "This user name is already taken" });

      const existsEmail = await prisma.user_account.findUnique({
        where: { email: email },
      });
      if (existsEmail) {
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }

      const user = await prisma.user_account.create({
        data: {
          user_name,
          email,
          password: crypto
            .createHmac("sha256", "secret")
            .update(password)
            .digest("hex"),
          first_name,
          last_name,
          gender,
          role_id,
        },
        include: {
          role: true,
        },
      });
      res.status(200).json({
        status: 200,
        message: "Data add successfully",
        data: generateToken(user),
      });
    } catch (e) {
      return res.status(500).json({ status: 500, message: e.message });
    }
  },

  // ADD USER POST
  async addUser(req, res) {
    try {
      const { user_id, image, userData } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (validator.isEmpty(image) || validator.isEmpty(user_id.toString())) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
          include: {
            role: true,
          },
        });

        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const {
              overview,
              experience,
              provider,
              description,
              links,
              location,
            } = userData;

            const freelancerData = await prisma.freelancer.create({
              data: {
                overview,
                experience,
                provider,
                description,
                links,
                location,
                user_account: {
                  connect: {
                    user_id: existsUser.user_id,
                  },
                },
              },
              include: {
                user_account: true,
              },
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image,
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data added successfully in freelancer user",
              data: freelancerData,
            });
          } else if (existsUser.role.name === "client") {
            const { overview, location } = userData;

            const clientData = await prisma.client.create({
              data: {
                overview,
                location,
                user_account: {
                  connect: {
                    user_id: existsUser.user_id,
                  },
                },
              },
              include: {
                user_account: true,
              },
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                image, // assuming 'image' is the Base64-encoded image string
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data added successfully in client user",
              data: clientData,
            });
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
  // GET all skills
  async getSkills(req, res) {
    try {
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        const skills = await prisma.skill_category.findMany({
          select: {
            skill_id: true,
            skill_name: true,
          },
        });
        return res.status(200).json({
          status: 200,
          data: skills,
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
  // get skills by freelanceridi
  async getSkillsByFreelancer(req, res) {
    try {
      const { freelancer_id } = req.query;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        const skills = await prisma.has_skill.findMany({
          where: {
            freelancer_id: Number(freelancer_id),
          },
          include: {
            skill_category: true,
          },
        });
        return res.status(200).json({
          status: 200,
          data: skills,
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
  // POST Add skills for freelancer
  async addSkills(req, res) {
    try {
      const { user_id, has_skills } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);

        const freelancerExists = await prisma.freelancer.findFirst({
          where: {
            useraccount_id: Number(user_id),
          },
        });

        if (freelancerExists) {
          const skillCategoryData = has_skills.map(({ skill_id }) => ({
            skill_id,
            freelancer_id: freelancerExists.freelancer_id,
          }));

          const skillsCat = await prisma.has_skill.createMany({
            data: skillCategoryData,
          });

          res.status(200).json({
            status: 200,
            message: "Skills added successfully for freelancer",
            data: skillCategoryData,
          });
        } else {
          return res
            .status(404)
            .send({ status: 404, data: "Freelancer not found" });
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

  // PUT Update both users info
  async updateUser(req, res) {
    try {
      const { user_id, image, first_name, last_name, userData } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(user_id.toString()) ||
          validator.isEmpty(image) ||
          validator.isEmpty(first_name) ||
          validator.isEmpty(last_name)
        ) {
          return res.status(400).send({ message: "Please provide all fields" });
        }
        const imgUrl = await uploadImage(image);
        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
          include: {
            role: true,
          },
        });

        if (existsUser) {
          if (existsUser.role.name === "freelancer") {
            const {
              overview,
              experience,
              provider,
              description,
              links,
              location,
            } = userData;

            const id = await prisma.freelancer.findFirst({
              where: {
                useraccount_id: user_id,
              },
            });

            const freelancerData = await prisma.freelancer.update({
              where: {
                freelancer_id: Number(id.freelancer_id),
              },
              data: {
                overview,
                experience,
                provider,
                description,
                links,
                location,
              },
            });
            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                first_name,
                last_name,
                image: imgUrl,
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data update successfully in freelancer user",
              data: freelancerData,
            });
          } else if (existsUser.role.name === "client") {
            const { overview, location } = userData;

            const id = await prisma.client.findFirst({
              where: {
                useraccount_id: user_id,
              },
            });

            const clientData = await prisma.client.update({
              where: {
                client_id: Number(id.client_id),
              },
              data: {
                overview,
                location,
              },
            });

            await prisma.user_account.update({
              where: { user_id: existsUser.user_id },
              data: {
                first_name,
                last_name,
                image: imgUrl,
              },
            });

            res.status(200).json({
              status: 200,
              message: "Data update successfully in client user",
              data: clientData,
            });
          }
        } else {
          return res
            .status(404)
            .send({ status: 404, message: "User is not found!!!" });
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

  // PUT Update password
  async updatePassword(req, res) {
    try {
      const { user_id, oldPassword, newPassword } = req.body;
      let token = req.headers["authorization"];

      if (token) {
        token = await verifyToken(token.split(" ")[1]);
        if (
          validator.isEmpty(user_id.toString()) ||
          validator.isEmpty(oldPassword) ||
          validator.isEmpty(newPassword)
        ) {
          return res.status(400).send({ message: "Please provide all fields" });
        }

        const existsUser = await prisma.user_account.findUnique({
          where: { user_id: user_id },
        });
        if (existsUser) {
          const correctPassword = await prisma.user_account.findFirst({
            where: {
              password: crypto
                .createHmac("sha256", "secret")
                .update(oldPassword)
                .digest("hex"),
            },
          });
          if (correctPassword) {
            const updatedUser = await prisma.user_account.update({
              where: { user_id: user_id },
              data: {
                password: crypto
                  .createHmac("sha256", "secret")
                  .update(newPassword)
                  .digest("hex"),
              },
            });
            return res.status(200).send({
              status: 200,
              message: "Password Changed!!",
              data: updatedUser,
            });
          } else {
            return res
              .status(401)
              .send({ status: 401, data: "Old Password is incorrect!!" });
          }
        } else {
          return res
            .status(404)
            .send({ status: 404, data: "User is not Found" });
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

  // DELETE User
  async deleteUser(req, res) {
    try {
      const { user_id } = req.query;
      if (validator.isEmpty(user_id.toString())) {
        return res.status(400).send({ message: "Please provide all fields" });
      }
      await prisma.user_account.delete({
        where: {
          user_id: Number(user_id),
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
