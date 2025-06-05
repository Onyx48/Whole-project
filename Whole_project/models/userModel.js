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
    unique: true,
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
    // IMPORTANT: These are the exact strings that will be stored in MongoDB.
    // They are all lowercase and use underscores for multi-word roles for consistency.
    enum: {
        values: ['student', 'educator', 'school_admin', 'superadmin'], // <<< UPDATED ENUM VALUES
        message: '{VALUE} is not a supported role. Must be student, educator, school_admin, or superadmin.'
    },
    required: [true, 'User role is required (student, educator, school_admin, or superadmin)'],
  },
}, {
    timestamps: true
});

// Hash password before saving a new user or when password is modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return false;
  }
};

const User = mongoose.model('User', userSchema);
export default User;