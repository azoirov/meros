const phoneValidation = require("../../validations/phone-validation");
const fs = require("fs/promises");
const path = require("path");
const sendSms = require("../../modules/send-sms");
const generateCode = require("../../modules/generate-code");
const codeValidation = require("../../validations/code-validation");
const signupValidation = require("../../validations/signup-validation");
const { generateToken } = require("../../modules/jwt");
const { Op } = require("sequelize");
const moment = require("moment");
const editFullNameValidation = require("../../validations/edit-full-name-validation");
const editEmailPhoneValidation = require("../../validations/edit-email-phone-validation");

module.exports = class UsersController {
  static async getSignUp(req, res) {
    res.render("signup", {
      title: "Meros | Signup",
      categories: req.categories,
    });
  }

  static async getLogin(req, res) {
    res.render("login", {
      title: "Meros | Login",
      categories: req.categories,
    });
  }

  static async CheckPhone(req, res) {
    try {
      const { users } = req.db;
      const { phone } = await phoneValidation.validateAsync(req.body);

      if (!phone) {
        throw new Error("invalid phone number");
      }

      let user = await users.findOne({
        where: {
          phone_number: phone,
        },
        raw: true,
      });

      res.status(200).json({
        ok: true,
        exists: user ? true : false,
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async Signup(req, res) {
    try {
      const { users, sessions } = req.db;

      const { name, email, phone } = await signupValidation.validateAsync(
        req.body
      );

      let user = await users.findOne({
        where: {
          phone_number: phone,
        },
      });

      if (user) {
        throw new Error("User has already been registered");
      }

      user = await users.create({
        phone_number: phone,
        full_name: name,
        email: email,
      });

      res.status(201).json({
        ok: true,
        message: "Registered",
        result: {
          user: { ...user.dataValues },
        },
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async Login(req, res) {
    try {
      const { users, attempts, bans } = req.db;

      const { phone } = await phoneValidation.validateAsync(req.body);

      let user = await users.findOne({
        where: {
          phone_number: phone,
        },
        raw: true,
      });

      if (!user) {
        throw new Error("User is not registered");
      }

      let ban = await bans.findOne({
        where: {
          user_id: user.user_id,
          expire_date: {
            [Op.gt]: new Date(),
          },
        },
        raw: true,
      });

      if (ban) {
        throw new Error(`You have banned until ${moment(ban.expire_date)}`);
      }

      let code = generateCode();

      await attempts.destroy({
        where: {
          user_id: user.user_id,
        },
      });

      let attempt = await attempts.create({
        code: code,
        user_id: user.user_id,
      });

      res.status(200).json({
        ok: true,
        message: "Code was sent",
        codeValidationId: attempt.dataValues.attempt_id,
        code: code,
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async ValidateCode(req, res) {
    try {
      const { users, attempts, sessions } = req.db;

      const code_validation_id = req.headers["code-validation-id"];

      const { code } = await codeValidation.validateAsync(req.body);

      if (!code_validation_id) {
        throw new Error("Invalid code validation id");
      }

      const attempt = await attempts.findOne({
        where: {
          attempt_id: code_validation_id,
        },
        include: {
          model: users,
          attributes: ["user_attempts"],
        },
        raw: true,
      });

      if (!attempt) throw new Error("Validation code is not found");

      let settings = await fs.readFile(
        path.join(__dirname, "..", "..", "settings.json"),
        (err, files) => {
          if (err) {
            throw new Error("Internal server Error");
          }
        }
      );

      settings = await JSON.parse(settings);

      if (Number(code) !== Number(attempt.code)) {
        await attempts.update(
          {
            attempts: attempt.attempts + 1,
          },
          {
            where: {
              attempt_id: code_validation_id,
            },
          }
        );
        if (Number(attempt.attempts) > Number(settings.code_attempts) - 2) {
          await attempts.destroy({
            where: {
              attempt_id: code_validation_id,
            },
          });

          await users.update(
            {
              user_attempts: attempt["user.user_attempts"] + 1,
            },
            {
              where: {
                user_id: attempt.user_id,
              },
            }
          );

          if (
            Number(attempt["user.user_attempts"]) >
            Number(settings.phone_attempts) - 2
          ) {
            await users.update(
              {
                user_attempts: 0,
              },
              {
                where: {
                  user_id: attempt.user_id,
                },
              }
            );

            await ban_model.create({
              user_id: attempt.user_id,
              expire_date: new Date(Date.now() + Number(settings.ban_time)),
            });
          }
        }
        throw new Error("Validation code is incorrect");
      }

      const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const userAgent = req.headers["user-agent"];

      if (!(ipAddress && userAgent)) {
        throw new Error("Invalid device");
      }

      const session = await sessions.create({
        user_id: attempt.user_id,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      const token = generateToken({
        session_id: session.dataValues.session_id,
      });

      await attempts.destroy({
        where: {
          user_id: attempt.user_id,
        },
      });

      await users.update(
        {
          user_attempts: 0,
        },
        {
          where: {
            user_id: attempt.user_id,
          },
        }
      );

      res.cookie("token", token);

      res.status(201).json({
        ok: true,
        message: "Logged in",
        token: token,
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async EditUserFullName(req, res) {
    try {
      const { firstName, lastName } =
        await editFullNameValidation.validateAsync(req.body);

      let user = await req.db.users.update(
        {
          full_name: firstName + " " + lastName,
        },
        {
          where: {
            user_id: req.user.id,
          },
        }
      );

      res.status(200).json({
        ok: true,
        message: "edited",
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async EditPhoneEmail(req, res) {
    try {
      const { phone, email } = await editEmailPhoneValidation.validateAsync(
        req.body
      );

      let user = await req.db.users.update(
        {
          phone_number: phone,
          email: email,
        },
        {
          where: {
            user_id: req.user.id,
          },
        }
      );

      res.status(200).json({
        ok: true,
        message: "edited",
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e + "",
      });
    }
  }

  static async AvatarPatchController(req, res) {
    try {
      if (req.files) {
        const { avatar } = req.files;

        const type = avatar.mimetype.split("/")[0];
        const format = avatar.mimetype.split("/")[1];

        if (type !== "image" && type !== "vector") {
          throw new Error("avatar image type must be an image or svg vector");
        }

        const avatar_path = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "images",
          "users",
          `${avatar.md5}.${format}`
        );

        await avatar.mv(avatar_path, (err) => {
          if (err) {
            throw new Error(err);
          }
        });

        let user = await req.db.users.update(
          {
            avatar: `${avatar.md5}.${format}`,
          },
          {
            where: {
              user_id: req.user.id,
            },
            raw: true,
            returning: true,
          }
        );

        user = await user[1][0];

        return res.status(200).json({
          ok: true,
          user: user,
        });
      }
      return res.status(200).json({
        ok: true,
        message: "not changed",
      });
    } catch (e) {
      res.status(400).json({
        ok: true,
        message: e + "",
      });
    }
  }

  static async ProfileGetController(req, res) {
    try {
      if (!req.user) {
        throw new Error("User is not Authorized");
      }

      let user = await req.db.users.findOne({
        where: {
          user_id: req.user.id,
        },
        raw: true,
      });

      let orders = await req.db.orders.findAll({
        raw: true,
        where: {
          user_id: user.user_id,
        },
      });

      for (let order of orders) {
        let order_items = await req.db.order_details.findAll({
          where: {
            order_id: order.order_id,
          },
          include: {
            model: req.db.products,
          },
          raw: true,
        });
        order.items = order_items;
      }

      res.status(200).json({
        ok: true,
        result: {
          user,
          orders,
        },
      });
    } catch (e) {
      res.status(403).json({
        ok: false,
        message: e + "",
      });
    }
  }
};
