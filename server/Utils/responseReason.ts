//Server
export const SERVER_ERROR = 'server-error';
export const SERVER_DOWN = 'server-down';
export const SERVER_UP = 'server-up';
export const INTERNAL_SERVER_ERROR = 'internal-server-error';
export const BAD_REQUEST = 'bad-request';

//DB
export const DB_UNABLE = 'db-unable';
export const DB_SUCCESS = 'db-success';

//Signup
export const SIGNUP_SUCCESS = 'signup-success';
export const SIGNUP_FAILURE = 'Signup-failed';
export const EMAIL_ALREADY_EXISTS = 'email-exists';
export const INVALID_EMAIL = 'invalid-email';
export const INVALID_PASSWORD = 'invalid-pass';

//Login
export const LOGIN_SUCCESS = 'login-success';
export const LOGIN_FAILURE = 'login-fail';
export const INVALID_CREDENTIALS = 'invalid-credentials';
export const USER_NOT_FOUND = 'no-user';
export const INCORRECT_PASSWORD = 'wrong-pass';

//OTP
export const OTP_SENT = 'otp-sent';
export const OTP_VERIFIED = 'otp-verified';
export const OTP_EXPIRED = 'otp-expired';
export const OTP_INVALID = 'invalid-otp';
export const OTP_RESEND = 'otp-resend';
export const OTP_NOT_GENERATED = 'otp-not-generated';

//GetUser
export const NO_USER_ID = 'no-user-id';
export const USER_FOUND = 'user-found';

//VerifyToken
export const NO_TOKEN = 'no-token';
export const INVALID_TOKEN = "invalid-token";

//RefreshToken
export const REFRESH_TOKEN_SUCCESS = 'refresh-token-success';
export const REFRESH_TOKEN_FAILURE = 'refresh-token-failure';
export const INVALID_REFRESH_TOKEN = 'invalid-refresh-token';


//Account
export const ACCOUNT_VERIFIED = 'account-verified';


//Room
export const ROOM_CREATED = 'room-created';
export const ROOM_CANNOT_CREATE = 'room-cannot-create';
export const ROOM_DELETED = 'room-deleted';
export const ROOM_NOT_FOUND = 'room-not-found';


//File
export const FILE_CREATED = 'file-created';
export const FILE_DELETED = 'file-deleted';
export const FILE_NOT_FOUND = 'file-not-found';
export const FILE_UPDATED = 'file-updated';
export const FILE_ALREADY_EXISTS = 'file-already-exists';


//VCS
export const NO_CHANGES_FOUND = 'no-changes-found';
export const CHANGES_ADDED = 'changes-added';
export const CHANGES_COMMITTED = 'changes-committed';
export const LOGS_FOUND = 'logs-found';
export const COMMIT_NOT_FOUND = 'commit-not-found';
