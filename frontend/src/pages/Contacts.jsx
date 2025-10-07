import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchContacts();
  }, []);

    const handleDelete = async (id) => {
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) return;
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
  });

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(120deg, #DBDBDBFF 0%, #66a6ff 100%)",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem",
        width: "80%"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <h2 style={{ margin: 0, color: "#333" }}>Mes contacts</h2>
          <button onClick={handleLogout} style={{
            ...buttonStyle,
            background: "#ef4444",
            fontSize: 14,
            padding: "8px 16px"
          }}>
            Logout
          </button>
        </div>

        <button 
          onClick={() => window.location.href = "/contacts/add"} 
          style={{
            ...buttonStyle,
            width: "100%",
            marginBottom: 20,
            background: "#10b981",
            fontSize: 16
          }}
        >
          + Ajouter un contact
        </button>

        <div style={{ 
          display: "flex", 
          gap: 10, 
          marginBottom: 18,
          flexDirection: "column",
          "@media (min-width: 640px)": {
            flexDirection: "row"
          }
        }}>
          <input
            placeholder="Recherche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <div style={{ color: "#e53e3e", marginBottom: 12, textAlign: "center" }}>{error}</div>}
        
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredContacts.map((c) => (
            <li key={c._id} style={{
              marginBottom: 18,
              padding: "16px",
              borderRadius: 10,
              background: "#f3f4f6",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px"
            }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: `hsl(${c.firstName.charCodeAt(0) * 137.508 % 360}, 70%, 60%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 18,
                flexShrink: 0
              }}>
                {c.firstName.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, color: "#333" }}>
                  {c.firstName} {c.lastName}
                </div>
                <div style={{ color: "#555", marginBottom: 4 }}>📞 {c.phone}</div>
                <div style={{ color: "#555", marginBottom: 12 }}>✉️ {c.email}</div>
                <div style={{ 
                  display: "flex", 
                  gap: 8,
                  flexDirection: "row"
                }}>
                  <button 
                    onClick={() => window.location.href = `/contacts/edit/${c._id}`} 
                    style={{...buttonStyle, flex: "1"}}
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(c._id)} 
                    style={{
                      ...buttonStyle, 
                      background: "#e53e3e",
                      flex: "1"
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
  flex: 1,
  minWidth: "150px",
  //width: "100%",
  backgroundColor: "#f3f4f6",
  color: "#000000",
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
