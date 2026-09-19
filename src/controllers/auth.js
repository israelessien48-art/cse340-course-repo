import bcrypt from "bcrypt";

import {
  getUserByEmail,
  createUser
} from "../models/users.js";

export const showRegisterForm = (req, res) => {
  res.render("register", {
    title: "Register",
    errors: [],
    data: {}
  });
};

export const processRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      req.flash("error", "An account with that email already exists.");
      return res.render("register", {
        title: "Register",
        errors: [],
        data: { name, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(name, email, passwordHash);

    req.flash("notice", "Registration successful. Please log in.");
    return res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);

    req.flash("error", "Registration failed. Please try again.");

    return res.render("register", {
      title: "Register",
      errors: [],
      data: { name, email }
    });
  }
};

export const showLoginForm = (req, res) => {
  res.render("login", {
    title: "Login",
    errors: [],
    data: {}
  });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.render("login", {
        title: "Login",
        errors: [],
        data: { email }
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      req.flash("error", "Invalid email or password.");
      return res.render("login", {
        title: "Login",
        errors: [],
        data: { email }
      });
    }

    req.session.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_id: user.role_id
    };

    req.flash("notice", "You are now logged in.");

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);

    req.flash("error", "Login failed. Please try again.");

    return res.render("login", {
      title: "Login",
      errors: [],
      data: { email }
    });
  }
};

export const processLogout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.redirect("/");
    }

    res.redirect("/");
  });
};