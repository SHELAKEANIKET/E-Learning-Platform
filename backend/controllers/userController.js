import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student", // default role = student
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
      token,
      message: "Signup Successful...!",
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      message: "Login Successful...!",
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.user;

    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      throw new ApiError(400, "Invalid Id");
    }

    return res
      .status(200)
      .json({ user, message: "User updated successfully..!" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserById = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses")
      .populate("createdCourses");

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    return res
      .status(200)
      .json({ user, message: "User data fetched successfully..!" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

export { signupUser, loginUser, updateUser, logoutUser, getUserById };
