import userModel from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing Required Fields",
        success: false,
      });
    }

    // Check if user exists
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hashing Password
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createJwtToken(newUser._id);

    return res.status(201).json({
      success: true,
      token,
      newUser,
    });
  } catch (error) {
    console.error("Error Registering User", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Missing Required Fields",
        success: false,
      });
    }

    // Check if user exists
    const userExists = await userModel.findOne({ email });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Hashing Password
    const correctPassword = await bcrypt.compare(password, userExists.password);

    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = createJwtToken(userExists._id);

    return res.status(201).json({
      success: true,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.error("Error Logging in User", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Current User
export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
