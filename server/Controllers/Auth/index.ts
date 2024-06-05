import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import AuthValidator from '../../Validators/Auth'
import Users, { IUser } from '../../Models/Users'
import { mailer } from '../../Utils'
import jsonwebtoken from 'jsonwebtoken'
import Config from '../../Config'
import RefreshToken, { IRefreshToken } from '../../Models/RefreshToken'
import Auth from '../../Models/Auth'
import { ACCOUNT_VERIFIED, EMAIL_ALREADY_EXISTS, INCORRECT_PASSWORD, INTERNAL_SERVER_ERROR, INVALID_TOKEN, LOGIN_FAILURE, LOGIN_SUCCESS, NO_TOKEN, NO_USER_ID, OTP_INVALID, OTP_NOT_GENERATED, REFRESH_TOKEN_SUCCESS, SERVER_ERROR, SIGNUP_FAILURE, SIGNUP_SUCCESS, USER_FOUND, USER_NOT_FOUND } from '../../Utils/responseReason'
import { otpgen } from '../../Utils/otpGen'

export const access_token_cookie_expiry = new Date(Date.now() + 1000 * 10 * 60);


const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET, FRONTEND_URL, APP_NAME } = Config;

export interface customRequest extends Request {
  user_id: string
  token: string
  email: string
  role: string
  verified: Boolean
}


const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (await AuthValidator.validateEmail(req.body.email)) {
      return res.status(200).json({
        status: 400,
        reason: EMAIL_ALREADY_EXISTS,
        success: false,
      })
    }

    const password = await bcrypt.hash(req.body.password, 12)
    const newUser = new Users({
      ...req.body,
      password: password,
    })

    await newUser.save()
    res.status(200).json({
      status: 201,
      reason: SIGNUP_SUCCESS,
      success: true,
    })
    mailer(
      req.body.email,
      `Account Created || ${APP_NAME}`,
      `Your Account has been created in the ${APP_NAME} portal.<br>To verify your account click on the link:- <a href="${FRONTEND_URL}/verify" target="_blank">${FRONTEND_URL}/verify</a>`,
      newUser._id,
      'acc_creation',
    )
    return
  } catch (err: any) {
    console.log(err)
    let errMsg = SIGNUP_FAILURE
    return res.status(200).json({
      status: err.status | 500,
      message: errMsg,
      reason: SERVER_ERROR,
      data: { ...err },
      success: false,
    })
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  const ACCESS_TOKEN_EXPIRY = '10m';
  try {
    const loginRequest = await AuthValidator.loginSchema.validateAsync(req.body);
    let user: IUser | null = await Users.findOne({ email: loginRequest.email });
    if (!user || user.deleted) {
      return res.status(200).json({
        status: 404,
        reason: USER_NOT_FOUND,
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (isMatch) {
      let refreshTokenColl: IRefreshToken | null = await RefreshToken.findOne({
        userId: user._id,
      });

      const tokenPayload = {
        user_id: user._id,
        role: user.role,
        username: user.name,
        email: user.email,
        verified: user.verified,
      };

      const token = jsonwebtoken.sign(tokenPayload, JWT_SECRET, { expiresIn: '10m' });
      const refreshToken = jsonwebtoken.sign(tokenPayload, JWT_REFRESH_TOKEN_SECRET);

      if (!refreshTokenColl) {
        const newRefreshTokenColl = new RefreshToken({
          userId: user._id,
          refreshToken: [refreshToken],
        });
        newRefreshTokenColl.save();
      } else {
        RefreshToken.updateOne(
          { userId: user._id },
          { $push: { refreshToken: refreshToken } }
        ).then((result: any) => {
          // console.log('Successfully updated the refresh token');
        })
          .catch((err: any) => {
            return res.status(406).json({
              reason: "email",
              message: "Unable to generate refresh token",
              success: false,
            });
            // console.error(err);
          });
      }


      res.cookie('token', token, {
        path: '/',
        expires: access_token_cookie_expiry,
        httpOnly: true,
        sameSite: 'lax',
      });

      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      const result = {
        reason: LOGIN_SUCCESS,
        success: true,
        status: 200,
        data: {
          token: token,
          refreshToken: refreshToken,
          expiresIn: access_token_cookie_expiry,
          user: user,
        }
      };

      return res.status(200).json(result);
    } else {
      return res.status(200).json({
        reason: INCORRECT_PASSWORD,
        success: false,
        status: 401,
        data: null
      });
    }
  } catch (e: any) {
    let errorMsg = LOGIN_FAILURE;
    if (e.isJoi === true) {
      e.status = 403;
      errorMsg = e.message;
    }
    return res.status(e.status || 500).json({
      status: e.status || 500,
      reason: LOGIN_FAILURE,
      success: false,
      data: { ...e }
    });
  }
};

const getuser = async (req: customRequest, res: Response, next: NextFunction) => {
  try {
    let user = null;
    if (req.user_id) {
      const userId = req.user_id;
      user = await Users.findById(userId, '-password');
    } else {
      return res.status(200).json({
        status: 400,
        reason: NO_USER_ID,
        success: false,
        data: null
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 404,
        reason: USER_NOT_FOUND,
        success: false,
        data: null
      });
    }

    return res.status(200).json({
      status: 200,
      reason: USER_FOUND,
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      status: 500,
      reason: INTERNAL_SERVER_ERROR,
      success: false,
      data: null
    });
  }
};

const verifytoken = (req: customRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.cookies && (req.cookies.token || req.cookies.accessToken)) {
    token = req.cookies.token || req.cookies.accessToken;
  } else if (req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    const bearerTokenMatch = authHeader && authHeader.match(/^Bearer (.+)$/);

    if (bearerTokenMatch) {
      token = bearerTokenMatch[1];
    }
  }
  if (!token) {
    return res.status(200).json({
      status: 409,
      reason: NO_TOKEN,
      success: false,
      data: null
    })
  }

  jsonwebtoken.verify(String(token), JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(200).json({
        status: 410,
        reason: INVALID_TOKEN,
        success: false,
        data: null

      })
    } else {
      req.user_id = user.user_id
      req.token = token
      req.email = user.email
      req.role = user.role
      req.verified = user.verified
      next()
    }
  })
}

const refresh = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const { user_id } = req;
  const refreshTokenColl = await RefreshToken.findOne({ userId: user_id });
  // console.log(refreshTokenColl);
  const user: IUser | null = await Users.findById(req.user_id).select('-password');
  // console.log(req.user_id);
  // console.log(user);
  if (!user) {
    return res.status(200).json({
      status: 404,
      reason: USER_NOT_FOUND,
      success: false,
      data: null
    });
  }

  if (!refreshTokenColl) {
    return res.status(200).json({
      status: 404,
      reason: NO_TOKEN,
      success: false,
      data: null
    });
  }

  let token = jsonwebtoken.sign(
    {
      user_id: user._id,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    JWT_SECRET,
    { expiresIn: '10m' },
  )
  res.cookie('token', token, {
    path: '/',
    expires: access_token_cookie_expiry,
    httpOnly: true,
    sameSite: 'lax',
  });

  return res.status(200).json({
    status: 200,
    reason: REFRESH_TOKEN_SUCCESS,
    success: true,
    data: {
      expiresIn: access_token_cookie_expiry,
      token: token,
      user: user,
    }
  })
}


const verifyRefreshToken = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  let token: string | undefined;
  if (req.cookies && (req.cookies.refreshToken || req.cookies.refreshAccessToken)) {
    token = req.cookies.refreshToken || req.cookies.refreshAccessToken;
  } else if (req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    const bearerTokenMatch = authHeader && authHeader.match(/^Refresh (.+)$/);

    if (bearerTokenMatch) {
      token = bearerTokenMatch[1];
    }
  }

  if (!token) {
    return res.status(200).json({
      status: 409,
      reason: NO_TOKEN,
      success: false,
      data: null
    });
  }

  // console.log(token);

  jsonwebtoken.verify(
    String(token),
    JWT_REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) {
        // console.log(err);
        return res.status(200).json({
          status: 410,
          reason: INVALID_TOKEN,
          success: false,
          data: null

        })
      } else {
        req.user_id = user.user_id
        req.email = user.email
        req.role = user.role
        req.verified = user.verified
        next()
      }
    },
  )
}

const verifyUser = async (email: any, verified: boolean) => {
  let user = await Users.findOne({ email })
  if (user) {
    user.verified = verified
    await user.save()
  }
}

const verify = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const auth_type = 'acc_verify'
  const { otp } = req.body
  const email = req.email
  if (await AuthValidator.validateEmail(email)) {
    let auth = await Auth.findOne({ email, auth_type: auth_type })
    if (auth) {
      if (auth.otp === otp) {
        verifyUser(email, true)
        await Auth.findByIdAndDelete(auth._id)
        // console.log(req._id);
        res.clearCookie(req.user_id)
        return res.status(200).json({
          status: 200,
          reason: ACCOUNT_VERIFIED,
          success: true,
          data: {}
        })
      } else {
        return res.status(200).json({
          status: 401,
          reason: OTP_INVALID,
          success: false,
          data: null
        })
      }
    } else {
      return res.status(200).json({
        status: 403,
        reason: OTP_NOT_GENERATED,
        success: false,
        data: null
      })
    }
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies
  const token = refreshToken

  res.clearCookie('token')
  res.clearCookie('refreshToken')

  if (!token) {
    return res.status(200).json({
      status: 404,
      reason: NO_TOKEN,
      success: false,
      data: null

    })
  }

  // if (!token) {
  // 	return res.status(200).json({
  // 		reason: "unauthorized",
  // 		message: "token not found",
  // 		success: false,
  // 	});
  // }

  jsonwebtoken.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(200).json(null)
    } else {
      RefreshToken.findOne({ refreshToken: refreshToken })
        .then((foundToken: any) => {
          // console.log(foundToken);
          if (!foundToken) {
            throw new Error('Invalid refreshToken')
          }

          // console.log("the email is :- " + user.username);

          return RefreshToken.updateOne(
            { username: user.username },
            { $pull: { refreshToken: refreshToken } },
          )
        })
        .then((result: any) => {
          if (result.nModified === 0) {
            throw new Error('Failed to remove refreshToken')
          }

          // console.log("Successfully removed the refreshToken from the array");
          return res.status(200).json(null)
        })
        .catch((err: any) => {
          console.error(err.message)
          return res.status(200).json(null)
        })
    }
  })
}
const generate = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const otp_len = 6
  const auth_type = 'acc_verify'
  let otp
  const email = req.email

  let auth
  try {
    auth = await Auth.findOne({ email, auth_type: auth_type })
  } catch (err) {
    return res.status(500).json({
      reason: 'error',
      message: 'Internal Server Error! Cannot generate OTP!',
      success: false,
    })
  }
  if (auth) {
    otp = auth.otp
  } else {
    otp = otpgen(otp_len)
    auth = new Auth({
      email,
      auth_type,
      otp,
    })

    try {
      await auth.save()
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        reason: 'error',
        message: 'Internal Server Error! Cannot generate OTP!',
        success: false,
      })
    }
  }

  try {
    mailer(
      email,
      'Account Verification OTP | Get-Me-Through',
      `Your account verification OTP is :- ${otp}`,
      email,
      auth_type,
    )
  } catch (e) {
    return res.status(500).json({
      reason: 'error',
      message: 'Internal Server Error! Unable to send E-Mail!! Mailer Error',
      success: false,
    })
  }

  return res.status(200).json({
    otp: otp,
    message: 'OTP generated successfully and sent to registered E-Mail',
    success: true,
  })
}

export default {
  signup,
  login,
  getuser,
  verifytoken,
  verifyRefreshToken,
  refresh,
  verify,
  logout,
  generate,
}
