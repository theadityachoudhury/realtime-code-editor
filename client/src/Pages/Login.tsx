import { useState, useRef, FormEvent } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Link } from 'react-router-dom';
import PageMeta from '../Utils/PageMeta';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<LoginFormData> = {};
    if (!formValues.email) {
      errors.email = 'Email is required';
    }
    if (!formValues.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      // Submit the form
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <PageMeta description='Login page for CodeSync' title='Login | CodeSync' robots='index' />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text uppercase bg-gradient-to-r from-purple-500 to-indigo-500">CodeSync</h1>
          <p className="text-gray-600">Login below to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              ref={emailRef}
              value={formValues.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="jason@codesync.com"
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
              <Link to='/forgot' className='text-indigo-600 text-md'>Forgot Password?</Link>
            </div>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                ref={passwordRef}
                value={formValues.password}
                onChange={handleChange}
                className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                placeholder="Password Here"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <Eye size={24} strokeWidth={1} /> : <EyeOff size={24} strokeWidth={1} />}
              </div>
            </div>
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Login
          </button>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <Link to="/register" className="text-indigo-600">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
