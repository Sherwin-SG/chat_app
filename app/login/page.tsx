'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

  const handleRegisterRedirect = () => {
    router.push('/register'); // Redirect to the register page
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={handleRegisterRedirect}>Go to Register</button>
    </div>
  );
}
