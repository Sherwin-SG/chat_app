'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        
        {error && <p className="mt-4 text-red-500">{error}</p>}
        
        <div className="mt-4 space-y-2">
          <button
            onClick={() => signIn('google')}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Login with Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900"
          >
            Login with GitHub
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>
        </div>
      </div>
    </div>
  );
}
