import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import Users from '../../Models/Users'
import { customRequest } from '../../Controllers/Auth'

const signupSchema = Joi.object({
  name: Joi.object({
    fname: Joi.string().required(),
    mname: Joi.string().min(0).optional(),
    lname: Joi.string().min(0).optional()
  }).optional(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_]{3,30}$'))
    .min(8)
    .required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_]{3,30}$'))
    .min(8)
    .required(),
})

const signupValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signupRequest = await signupSchema.validateAsync(req.body)
    next()
  } catch (err: any) {
    return res.status(err.status || 403).json({
      message: err.message || 'An error occurred',
      success: false,
    })
  }
}

const validateEmail = async (email: string) => {
  const user = await Users.findOne({ email: email }).select('email')
  return user ? true : false
}

const verification = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.verified) {
    return res.status(200).json({
      status: 404,
      reason: 'already-verified',
      success: false,
      data: null
    })
  } else {
    next()
  }
}
const isOTP = (req: customRequest, res: Response, next: NextFunction) => {
  if (req.body.otp) {
    next()
  } else {
    return res.status(200).json({
      status: 404,
      reason: 'no-otp',
      success: false,
      data: null
    })
  }
}

const passwordSchema = Joi.object({
  otp: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_]{3,30}$'))
    .min(8)
    .required(),
})

export default {
  signupValidator,
  validateEmail,
  loginSchema,
  verification,
  isOTP,
  passwordSchema,
}
