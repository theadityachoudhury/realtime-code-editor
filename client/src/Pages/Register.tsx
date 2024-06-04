import { useState, useRef, FormEvent } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Link } from 'react-router-dom';

interface RegistrationFormData {
  fname: string;
  mname?: string;
  lname?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState<RegistrationFormData>({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<RegistrationFormData>>({});
  const fnameRef = useRef<HTMLInputElement>(null);
  const mnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<RegistrationFormData> = {};
    if (!formValues.fname) {
      errors.fname = 'First name is required';
    }
    if (!formValues.email) {
      errors.email = 'Email is required';
    }
    if (!formValues.password) {
      errors.password = 'Password is required';
    }
    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">Register</h1>
          <p className="text-gray-600">Create your account below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="fname" className="block text-lg font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                ref={fnameRef}
                value={formValues.fname}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="First Name"
              />
              {formErrors.fname && <p className="text-red-500 text-sm">{formErrors.fname}</p>}
            </div>
            <div>
              <label htmlFor="mname" className="block text-lg font-medium text-gray-700">Middle Name (optional)</label>
              <input
                type="text"
                name="mname"
                id="mname"
                ref={mnameRef}
                value={formValues.mname}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Middle Name"
              />
            </div>
            <div>
              <label htmlFor="lname" className="block text-lg font-medium text-gray-700">Last Name (optional)</label>
              <input
                type="text"
                name="lname"
                id="lname"
                ref={lnameRef}
                value={formValues.lname}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Last Name"
              />
            </div>
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
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  ref={passwordRef}
                  value={formValues.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={togglePasswordVisibility}>
                  {showPassword ? <Eye size={24} strokeWidth={1} /> : <EyeOff size={24} strokeWidth={1} />}
                </div>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  ref={confirmPasswordRef}
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                  placeholder="Confirm Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <Eye size={24} strokeWidth={1} /> : <EyeOff size={24} strokeWidth={1} />}
                </div>
              </div>
              {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Register
          </button>
          <p className="text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
