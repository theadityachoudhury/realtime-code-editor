import { z } from "zod";

export const registrationSchema = z.object({
    fname: z.string().min(1, 'First name is required'),
    mname: z.string().optional(),
    lname: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});


export const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 characters long'),
});


