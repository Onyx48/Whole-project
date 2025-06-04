// WHOLE_PROJECT/routes/users.js
import express from 'express';
import User from '../models/userModel.js';
import Student from '../models/studentModel.js'; // For cascade delete if user is student

const router = express.Router();

// GET /api/users - Get all users (Frontend should ensure only superadmin calls this)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users - Create a new user (e.g., teacher, another admin)
// (Frontend should ensure only superadmin calls this)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Name, email, password, and role are required." });
    }
    if (!['Student', 'Educator', 'School Admin', 'Super Admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified. Must be Student, Educator, School Admin, or Super Admin." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    // If superadmin creates a student user, also create their student profile
    if (newUser.role === 'Student') {
        const studentProfileExists = await Student.findOne({ user: newUser._id });
        if (!studentProfileExists) { // Avoid duplicate profiles
            const studentProfile = new Student({ user: newUser._id });
            await studentProfile.save();
        }
    }

    const userResponse = { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role };
    res.status(201).json({ success: true, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id - Get user by ID
// (Frontend should ensure only superadmin calls this)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
     if (err.kind === 'ObjectId') { // Handle invalid ObjectId format
        return res.status(404).json({ message: 'User not found (invalid ID format)' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id - Update user details (name, email, role)
// (Frontend should ensure only superadmin calls this)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body; // Superadmin can change these. Password change needs separate logic.

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email; // Add validation if email is changed (check for uniqueness)

    const oldRole = user.role;
    if (role && role !== oldRole) {
        if (!['Student', 'Educator', 'School Admin', 'Super Admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified. Must be Student, Educator, School Admin, or Super Admin." });
        }
        user.role = role;
        // If role changes from student, delete their student profile
        if (oldRole === 'Student' && role !== 'Student') {
            await Student.findOneAndDelete({ user: user._id });
        }
        // If role changes to student, create their student profile if it doesn't exist
        else if (oldRole !== 'Student' && role === 'Student') {
            const studentProfileExists = await Student.findOne({ user: user._id });
            if (!studentProfileExists) {
                const studentProfile = new Student({ user: user._id });
                await studentProfile.save();
            }
        }
    }

    const updatedUser = await user.save();
    const userResponse = { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
    res.status(200).json({ success: true, user: userResponse });
  } catch (err) {
    // Handle potential duplicate email error if email is being changed
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.status(400).json({ message: "Email already in use by another account." });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id - Delete a user
// (Frontend should ensure only superadmin calls this)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is a student, also delete their student profile
    if (user.role === 'Student') {
      await Student.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;