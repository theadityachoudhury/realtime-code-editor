import { useState, useRef, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface ForgetPasswordFormData {
  email: string;
}

const Forget = () => {
  const [formValues, setFormValues] = useState<ForgetPasswordFormData>({
    email: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<ForgetPasswordFormData>>({});
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Partial<ForgetPasswordFormData> = {};
    if (!formValues.email) {
      errors.email = 'Email is required';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      // Handle the forget password request
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

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">Forget Password</h1>
          <p className="text-gray-600">Enter your email below to reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
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
                placeholder="your-email@example.com"
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Submit
          </button>
          <p className="text-center text-gray-600">
            Remembered your password? <Link to="/login" className="text-indigo-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Forget;
