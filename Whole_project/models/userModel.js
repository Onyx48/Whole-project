// WHOLE_PROJECT/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures email is unique across all users in this collection
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address. Example: user@example.com'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: {
        values: ['Student', 'Educator', 'School Admin', 'Super Admin'],
        message: '{VALUE} is not a supported role. Must be Student, Educator, School Admin, or Super Admin.'
    },
    required: [true, 'User role is required (Student, Educator, School Admin, or Super Admin)'],
  },
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
    // collection: 'users' // Mongoose does this by default (pluralize & lowercase model name 'User')
                           // but you can be explicit if you want.
});

// Hash password before saving a new user or when password is modified
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware or save operation
  }
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return false; // Or throw error, depending on how you want to handle bcrypt errors
  }
};

const User = mongoose.model('User', userSchema);

export default User;