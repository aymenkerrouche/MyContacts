const Contact = require("../models/Contact");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, owner: req.userId });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    res.json({ message: "Contact supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
