// Define a type that lists all valid keys
export type ResponseMessageKey =
    | 'server-error'
    | 'server-down'
    | 'server-up'
    | 'internal-server-error'
    | 'signup-success'
    | 'signup-failed'
    | 'email-exists'
    | 'invalid-email'
    | 'invalid-pass'
    | 'login-success'
    | 'login-fail'
    | 'invalid-credentials'
    | 'no-user'
    | 'wrong-pass'
    | 'otp-sent'
    | 'otp-verified'
    | 'otp-expired'
    | 'invalid-otp'
    | 'otp-resend'
    | 'otp-not-generated'
    | 'no-user-id'
    | 'user-found'
    | 'no-token'
    | 'invalid-token'
    | 'refresh-token-success'
    | 'refresh-token-failure'
    | 'invalid-refresh-token'
    | 'account-verified';

// Define the responseMessages object with the above keys and their respective messages
const responseMessages: Record<ResponseMessageKey, string> = {
    'server-error': 'A server error has occurred. Please try again later.',
    'server-down': 'The server is currently down. Please try again later.',
    'server-up': 'The server is up and running.',
    'internal-server-error': 'An internal server error has occurred. Please try again later.',
    'signup-success': 'Signup successful. Welcome!',
    'signup-failed': 'Signup failed. Please try again.',
    'email-exists': 'This email address is already in use.',
    'invalid-email': 'The provided email address is invalid.',
    'invalid-pass': 'The provided password is invalid.',
    'login-success': 'Login successful. Welcome back!',
    'login-fail': 'Login failed. Please try again.',
    'invalid-credentials': 'Invalid email or password.',
    'no-user': 'No user found with this email address.',
    'wrong-pass': 'Incorrect password. Please try again.',
    'otp-sent': 'OTP has been sent to your email.',
    'otp-verified': 'OTP has been verified successfully.',
    'otp-expired': 'OTP has expired. Please request a new one.',
    'invalid-otp': 'The provided OTP is invalid.',
    'otp-resend': 'OTP has been resent to your email.',
    'otp-not-generated': 'OTP could not be generated. Please try again later.',
    'no-user-id': 'No user ID provided.',
    'user-found': 'User found successfully.',
    'no-token': 'No token provided. Please login again.',
    'invalid-token':'Invalid token! Session expired. Please login again.',
    'refresh-token-success': 'Token refreshed successfully.',
    'refresh-token-failure': 'Failed to refresh token. Please login again.',
    'invalid-refresh-token': 'Invalid refresh token. Please login again.',
    'account-verified': 'Your account has been verified successfully.'
};

export default responseMessages;
