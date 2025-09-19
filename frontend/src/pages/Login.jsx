import React, { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await api.post("/auth/register", form);
        setIsSignup(false);
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
    <div className="auth-container">
      <h2>{isSignup ? "Inscription" : "Connexion"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} required />
            <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} required />
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
        <button type="submit">{isSignup ? "S'inscrire" : "Se connecter"}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)} style={{ marginTop: 10 }}>
        {isSignup ? "Déjà inscrit ? Se connecter" : "Créer un compte"}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
