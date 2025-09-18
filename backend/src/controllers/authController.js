const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hashage
    const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT_ROUNDS);

    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    // Vérifie mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

    // token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
