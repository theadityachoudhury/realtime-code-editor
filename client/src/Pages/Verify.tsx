import { useState, useEffect } from "react"; // Import useEffect for timer
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import instance from '../axios';
import handleServerResponse from '../Utils/serverMessages';
import sleep from '../Utils/Sleep';
import useToast from '../Hooks/useToast';
import { otpSchema } from '../Schema/Auth';
import OTPInput from "../Components/OTPInput";
import PageMeta from "../Utils/PageMeta";
import config from "../Config";
import { useUserContext } from '../context/UserProvider';

type OTPFormData = z.infer<typeof otpSchema>;

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(20); // Initial timer value
  const { toastSuccess, toastError, toastWarn } = useToast();
  const { user, authenticated, ready, verify, logout } = useUserContext();

  const sendOTP = async () => {
    try {
      const { data } = await instance.post('/api/auth/generate');
      if (data.status === 200) {
        toastSuccess(handleServerResponse(data.reason), 5000);
      } else {
        toastError(handleServerResponse(data.reason), 5000);
      }
    } catch (error) {

    }

  }

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    sendOTP().then().catch((err: any) => { console.log(err) });
  }, [])

  // Effect to start and reset timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup on unmount or timer reset
  }, [timer]);

  const handleResendOTP = () => {
    sendOTP().then().catch((err: any) => { console.log(err) });
    setTimer(20);
  };

  const onSubmit = async (data: OTPFormData) => {
    if (loading) return;
    setLoading(true);

    const apiData = {
      otp: data.otp,
    }

    try {
      const { data } = await instance.post('/api/auth/verify', apiData);
      console.log(data);
      if (data.status === 200) {
        toastSuccess(handleServerResponse(data.reason), 5000);
        reset();
        await sleep(3000);
        verify();
        // Navigate to a different page after successful verification
        // window.location.href = '/dashboard';
      } else {
        toastError(handleServerResponse(data.reason), 5000);
        if (data.reason === 'already-verified') {
          verify();
        }
      }
    } catch (error) {
      console.error(error);
      toastWarn("Your Internet is disconnected!! Please check your connection and try again!!");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated && ready && user && user.verified) {
    return <Navigate to='/' />
  }

  if (authenticated && ready && user && !user.verified)
    return (
      <div className="flex h-screen justify-center items-center text-black">
        <PageMeta title='CodeSync | Verify' description='Verify your account on CodeSync to collaborate on code in real-time with your team. Experience seamless, multi-user coding with our online code editor. Sign up now!' canonical={`${config.FRONTEND_URL}/verify`} />
        <div className="bg-slate-200 p-10 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">Verification</h1>
            <p className="text-gray-600">Verify your account to continue</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="sm:flex space-x-2 space-y-2 sm:space-y-0">
                <label htmlFor="otp" className="text-left pl-6 sm:pl-0 sm:ml-3 sm:py-2 text-xl">OTP</label>
                <OTPInput
                  length={6}
                  autoFocus
                  onChangeOTP={(otp) => { setValue('otp', otp); if (errors.otp) clearErrors('otp'); }}
                  className="mx-2"
                  inputClassName="otpInput border rounded-md px-2 py-1 mr-1"
                />
              </div>
              <div>
                {errors.otp && <p className="text-red-500 text-sm px-14">{errors.otp.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            {/* Resend OTP button with timer */}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={timer > 0} // Disable when timer is running
              className={`mt-2 w-full bg-gray-300 text-indigo-600 text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${timer > 0 ? 'cursor-not-allowed' : ''}`}
            >
              Resend OTP {timer > 0 && `(${timer}s)`}
            </button>
          </form>

          <div className="text-center font-bold mt-10 bg-red-950 hover:bg-red-800 rounded-md p-2 cursor-pointer" onClick={logout}>
            <p className="text-red-100 hover:text-red-200">Wanna Logout?</p>
          </div>
        </div>
      </div>
    );
};

export default Verify;
