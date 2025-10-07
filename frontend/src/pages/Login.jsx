import React, { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        const res = await api.post("/auth/register", { email: form.email, password: form.password });
        //setIsSignup(false);
        localStorage.setItem("token", res.data.token);
        window.location.href = "/contacts";
      } else {
        const res = await api.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        window.location.href = "/contacts";
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || "Erreur");
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #DBDBDBFF 0%, #66a6ff 100%)",
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem 2.5rem",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: 400,
        boxSizing: "border-box"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#000000" }}>{isSignup ? "Inscription" : "Connexion"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>{isSignup ? "S'inscrire" : "Se connecter"}</button>
        </form>
        <button onClick={() => setIsSignup(!isSignup)} style={{ ...buttonStyle, background: "#e0e7ff", color: "#333", marginTop: 10, width: "100%" }}>
          {isSignup ? "Déjà inscrit ? Se connecter" : "Créer un compte"}
        </button>
        {error && <div style={{ color: "#e53e3e", marginTop: 12, textAlign: "center" }}>{error}</div>}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #f3f4f6",
  fontSize: 16,
  outline: "none",
  color: "#000000",
  backgroundColor: "#f3f4f6",
};

const buttonStyle = {
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  background: "#66a6ff",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  transition: "background 0.2s"
};
