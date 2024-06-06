import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../Schema/Auth';
import instance from '../axios';
import handleServerResponse from '../Utils/serverMessages';
import sleep from '../Utils/Sleep';
import useToast from '../Hooks/useToast';
import { useUserContext } from '../context/UserProvider';
import PageMeta from '../Utils/PageMeta';
import config from '../Config';



type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toastSuccess, toastError, toastWarn } = useToast();

  const { authenticated, ready, user } = useUserContext();

  const [params] = useSearchParams();
  const callback = params.get("callback");

  const [nav, setNav] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegistrationFormData) => {
    if (loading) return;
    setLoading(true);
    // Submit the form
    const apiData = {
      name: {
        fname: data.fname,
        mname: data.mname,
        lname: data.lname,
      },
      email: data.email,
      password: data.password,
    };

    try {
      const { data } = await instance.post('/api/auth/register', apiData);
      if (data.status === 201) {
        toastSuccess(handleServerResponse(data.reason), 5000);
        reset();
        await sleep(3000);
        setNav(true);
      } else if (data.status === 400) {
        toastError(handleServerResponse(data.reason), 5000);
      }
    } catch (error) {
      console.error(error);
      toastWarn("Your Internet is disconnected!! Please check your connection and try again!!")
    } finally {
      setLoading(false);
    }


  };

  const handleEmailBlur = async () => {
    // Manually trigger validation for the email field
    await trigger('email');
  };

  const handleFnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue('fname', value);
    // Clear error for 'fname' field if value is updated
    if (errors.fname) {
      clearErrors('fname');
    }
  };

  if (authenticated && ready && user) {
    if (callback) {
      return <Navigate to={callback} />
    }
    return <Navigate to='/' />
  }

  if (nav) {
    return <Navigate to={callback ? `/login?callback=${callback}` : `/login`} />
  }

  if (!authenticated && ready && !user)
    return (
      <div className="flex h-screen justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500">
        <PageMeta title='CodeSync | Register' description='Create an account on CodeSync to collaborate on code in real-time with your team. Experience seamless, multi-user coding with our online code editor. Sign up now!' canonical={`${config.FRONTEND_URL}/register`} />
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">Register</h1>
            <p className="text-gray-600">Create your account below</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="fname" className="block text-lg font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  {...register('fname')}
                  onChange={handleFnameChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="First Name"
                />
                {errors.fname && <p className="text-red-500 text-sm">{errors.fname.message}</p>}
              </div>
              <div>
                <label htmlFor="mname" className="block text-lg font-medium text-gray-700">Middle Name (optional)</label>
                <input
                  type="text"
                  {...register('mname')}
                  className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Middle Name"
                />
              </div>
              <div>
                <label htmlFor="lname" className="block text-lg font-medium text-gray-700">Last Name (optional)</label>
                <input
                  type="text"
                  {...register('lname')}
                  className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  onBlur={handleEmailBlur}
                  className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="jason@codesync.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <Eye size={24} strokeWidth={1} /> : <EyeOff size={24} strokeWidth={1} />}
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm Password</label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                    placeholder="Confirm Password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowConfirmPassword(prev => !prev)}>
                    {showConfirmPassword ? <Eye size={24} strokeWidth={1} /> : <EyeOff size={24} strokeWidth={1} />}
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-center text-gray-600">
              Already have an account? <Link to={callback ? `/login?callback=${callback}` : `/login`} className="text-indigo-600">Login</Link>
            </p>
          </form>
        </div>
      </div>
    );
};

export default Register;
