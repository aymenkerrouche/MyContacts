const Contact = require("../models/Contact");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.userId });
    res.json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({ error: { type: "ServerError", message: error.message } });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10 || phone.length > 20) {
      return res
        .status(400)
        .json({
          error: {
            type: "ValidationError",
            message:
              "Le numéro de téléphone doit contenir entre 10 et 20 caractères.",
          },
        });
    }
    const contact = await Contact.create({ ...req.body, owner: req.userId });
    res.status(201).json(contact);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: { type: "ValidationError", message: error.message } });
    }
    res
      .status(500)
      .json({ error: { type: "ServerError", message: error.message } });
  }
};

exports.updateContact = async (req, res) => {
  try {
    if (
      req.body.phone &&
      (req.body.phone.length < 10 || req.body.phone.length > 20)
    ) {
      return res
        .status(400)
        .json({
          error: {
            type: "ValidationError",
            message:
              "Le numéro de téléphone doit contenir entre 10 et 20 caractères.",
          },
        });
    }
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact)
      return res
        .status(404)
        .json({
          error: { type: "NotFoundError", message: "Contact non trouvé" },
        });
    res.json(contact);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: { type: "ValidationError", message: error.message } });
    }
    res
      .status(500)
      .json({ error: { type: "ServerError", message: error.message } });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });
    if (!contact)
      return res
        .status(404)
        .json({
          error: { type: "NotFoundError", message: "Contact non trouvé" },
        });
    res.json({ message: "Contact supprimé" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: {
          type: "ServerError",
          message: "Erreur lors de la suppression : " + error.message,
        },
      });
  }
};
