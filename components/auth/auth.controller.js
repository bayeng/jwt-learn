/* eslint-disable object-shorthand */
// eslint-disable-next-line import/no-extraneous-dependencies
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/prismaClient');

async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email && !password && !name) {
      return res.status(400).json({
        status: 'failed',
        message: 'name, email,  password is required',
      });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({
        status: 'failed',
        message: 'email already used',
      });
    }

    const encryptPassword = await passwordHash.generate(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptPassword,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    );
    user.token = token;

    return res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'email or password is required',
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    const verifiyPassword = await passwordHash.verify(password, user.password);
    if (email && verifiyPassword) {
      const userToken = jwt.sign(
        {
          user,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        },
      );
      user.token = userToken;
      res.status(200).json({
        status: 'success',
        user,
      });
    }
    return res.status(400).json({
      status: 'failed',
      message: 'invalid email or password',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: error.message,
    });
  }
}

module.exports = {
  register,
  login,
};
