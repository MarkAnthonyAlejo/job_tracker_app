import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { supabase } from "../Connection/supabase.js";

export const login = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},username.eq.${username}`);

    if (userError) {
      console.error("Supabase query error:", userError);
      return res.status(500).json({ message: "Error fetching user" });
    }

    const existingUser = users && users.length > 0 ? users[0] : null;

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcryptjs.compare(password, existingUser.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
      message: "Login Succesful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  console.log("Your in the BackEnd");
  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("email")
      .or(`email.eq.${email},username.eq.${username}`);

    if (existingUserError) {
      console.error("Supabase query error:", existingUserError);
      return res.status(500).json({ message: "Error checking existing user" });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const { data: newUser, error: insetError } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          password: hashPassword,
          created_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (insetError) {
      console.error("Supabase insert error:", insetError);
      if (insetError.message && insetError.message.includes("duplicate key")) {
        return res.status(400).json({
          message: "Email or Username already exist (duplicate key)",
        });
      }

      return res.status(500).json({ message: "Error creating user" });
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token);

    res.status(200).json({
      user: newUser,
      message: "user as been registered",
      token: token,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({ message: "Server error" });
  }
};

// Gets the user
export const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const { data: foundUser, error } = await supabase
      .from("users")
      .select("username, id")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(foundUser, "This is the user");
    res.status(200).json(foundUser);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
