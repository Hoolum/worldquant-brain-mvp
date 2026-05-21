import React, { useState } from "react";
import axios from "axios";

export default function StrategySubmit({ token }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/strategy/submit",
        { name, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(`Performance: ${res.data.performance}% (ID: ${res.data.id})`);
      setError("");
    } catch (err) {
      setError("Submit failed: " + (err.response?.data?.message || "error"));
    }
  }

  return (
    <div>
      <h2>Submit Strategy</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Strategy Name"
        />
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Strategy Code (e.g. buy_and_hold)"
        />
        <button type="submit">Submit</button>
      </form>
      {result && <div style={{ color: "green" }}>{result}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
