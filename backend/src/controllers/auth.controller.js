const bcrypt = require("bcrypt");
const User = require("../models/User");

// AUTO LOGIN / AUTO REGISTER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user = await User.findOne({ email, authProvider: "local" });

    // First time → auto register
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        email,
        password: hashedPassword,
        name: email.split("@")[0],
        authProvider: "local",
      });

      return res.status(200).json({ message: "User created and logged in" });
    }

    // Existing user → verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

// RESET PASSWORD (SAFE VERSION)
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const user = await User.findOne({ email, authProvider: "local" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Password reset failed" });
  }
};
