import { useAuth } from '../lib/useAuth';

export default function Dashboard() {
  useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}
