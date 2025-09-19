import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [error, setError] = useState("");

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
    <div className="edit-contact-container">
      <h2>Modifier le contact</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="Prénom" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Nom" value={form.lastName} onChange={handleChange} required />
        <input name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">Enregistrer</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
