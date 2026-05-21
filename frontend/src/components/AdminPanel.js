import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [error, setError] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
        setUsers(res.data);
        setError("");
      } catch (e) {
        setError("Failed to load users or not admin");
      }
    }
    loadData();
  }, [token, reload]);

  async function promote(id) {
    try {
      await axios.post(`/api/admin/users/${id}/promote`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUserMsg("User promoted");
      setReload(c => c + 1);
    } catch (e) {
      setUserMsg("Failed to promote user");
    }
  }

  async function loadStrategies() {
    try {
      const res = await axios.get("/api/leaderboard");
      setStrategies(res.data);
      setError("");
    } catch (e) {
      setError("Failed to load strategies");
    }
  }

  async function delStrategy(id) {
    try {
      await axios.delete(`/api/admin/strategies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUserMsg("Strategy deleted");
      setStrategies(old => old.filter(s => s.id !== id));
    } catch (e) {
      setUserMsg("Failed to delete strategy");
    }
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      <h3>Users</h3>
      {userMsg && <div>{userMsg}</div>}
      <button onClick={loadStrategies}>Show Strategies</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} (Admin: {user.isAdmin ? "yes" : "no"}) <button onClick={() => promote(user.id)}>Promote</button></li>
        ))}
      </ul>
      <h3>All Strategies</h3>
      <ul>
        {strategies.map(strat => (
          <li key={strat.id}>{strat.name} ({strat.username}, {strat.performance}%) <button onClick={()=>delStrategy(strat.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
}
