const express = require("express");
const passport = require("passport");

const router = express.Router();

// STEP 1: Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// STEP 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Successful login
    // Later we will send JWT here

    res.redirect("http://localhost:3000/dashboard");
  }
);

module.exports = router;
