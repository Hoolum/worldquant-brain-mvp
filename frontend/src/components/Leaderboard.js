import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/leaderboard")
      .then((res) => {
        setRows(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Failed to load leaderboard");
      });
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>User</th>
            <th>Performance (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.username}</td>
              <td>{row.performance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
