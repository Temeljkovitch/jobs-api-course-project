const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

// Importing specific errors
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (request, response) => {
  // Checking for empty values in the controller
  // const { name, email, password } = request.body;
  //   if (!name || !email || !password) {
  //     throw new BadRequestError("Please provide name, email and password!");
  //   }

  const user = await User.create(request.body);
  const token = user.createJWT();
  response
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token });
};

const login = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    throw new BadRequestError("Please, provide email and password!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  response.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
