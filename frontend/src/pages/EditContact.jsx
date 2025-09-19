import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [error, setError] = useState("");

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
    outline: "none"
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

  useEffect(() => {
    api.get(`/contacts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => {
      const contact = res.data.find(c => c._id === id);
      if (contact) setForm(contact);
      else setError("Contact introuvable");
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.patch(`/contacts/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/contacts");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Erreur");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem 2.5rem",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: 320,
        maxWidth: 360
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Modifier le contact</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} required style={inputStyle} />
          <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} required style={inputStyle} />
          <input name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} required style={inputStyle} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
          <button type="submit" style={buttonStyle}>Enregistrer</button>
        </form>
        {error && <div style={{ color: "#e53e3e", marginTop: 12, textAlign: "center" }}>{error}</div>}
      </div>
    </div>
  );
}
