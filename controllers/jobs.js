const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (request, response) => {
  const jobs = await Job.find({ createdBy: request.user.userId }).sort(
    "createdAt"
  );
  response.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getSingleJob = async (request, response) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = request;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  response.status(StatusCodes.OK).json({ job });
};

const createJob = async (request, response) => {
  request.body.createdBy = request.user.userId;
  console.log(request.body);
  const job = await Job.create(request.body);
  response.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (request, response) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = request;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty!");
  }

  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    request.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  response.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (request, response) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = request;
  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  response.status(StatusCodes.OK).json();
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
};
