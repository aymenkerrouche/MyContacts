import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setContacts(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des contacts, " + err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

    const handleDelete = async (id) => {
      if (!window.confirm("Supprimer ce contact ?")) return;
      try {
        await api.delete(`/contacts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setContacts(contacts.filter((c) => c._id !== id));
      } catch {
        setError("Erreur lors de la suppression");
      }
    };

  const filteredContacts = contacts.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  }).filter((c) => {
    if (!filter) return true;
    return c.phone.startsWith(filter);
  });

  return (
    <div className="contacts-container">
      <h2>Mes contacts</h2>
      <input
        placeholder="Recherche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, marginRight: 10 }}
      />
      <input
        placeholder="Filtrer par indicatif (ex: 06)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={inputStyle}
      />
      {error && <div className="error">{error}</div>}
      <ul>
        {filteredContacts.map((c) => (
          <li key={c._id} style={{ marginBottom: 10 }}>
            <b>{c.firstName} {c.lastName}</b> <br />
            Tel: {c.phone} <br />
            Email: {c.email} <br />
            <button onClick={() => window.location.href = `/contacts/edit/${c._id}`} style={buttonStyle}>Modifier</button>
            <button onClick={() => handleDelete(c._id)} style={{ ...buttonStyle, background: "#e53e3e", marginLeft: 5 }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
    outline: "none",
    flex: 1
  };

  const buttonStyle = {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    background: "#66a6ff",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s"
  };
