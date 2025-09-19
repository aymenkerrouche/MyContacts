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
    } catch (err) {
      setError("Erreur lors de la suppression, " + err.message);
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
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="Filtrer par indicatif (ex: 06)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <ul>
        {filteredContacts.map((c) => (
          <li key={c._id} style={{ marginBottom: 10 }}>
            <b>{c.firstName} {c.lastName}</b> <br />
            Tel: {c.phone} <br />
            Email: {c.email} <br />
            <button onClick={() => window.location.href = `/contacts/edit/${c._id}`}>Modifier</button>
            <button onClick={() => handleDelete(c._id)} style={{ marginLeft: 5 }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
