// WHOLE_PROJECT/routes/authRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import otpGenerator from "otp-generator";
import User from "../models/userModel.js"; // Your single User model
import { sendOTPEmail } from "../WHOLE_PROJECT/utils/emailService.js";
import redisClient from "../WHOLE_PROJECT/utils/redisClient.js";
// bcryptjs is used by the userModel.js pre-save hook, not directly in this file for hashing.
// It's imported here potentially for completeness or if you were to add direct password comparisons later,
// but strictly speaking, for the current logic, it's not directly invoked in *this* file.
import bcrypt from "bcryptjs";

const router = express.Router();

const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_SECONDS || "300", 10);
const MAX_ATTEMPTS = parseInt(process.env.MAX_OTP_ATTEMPTS || "5", 10);

console.log("authRoutes.js file is being loaded/executed"); // Debug: Confirm file load

// --- Helper function to generate OTP ---
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

// --- Store OTP in Redis (or fallback) ---
const storeOTP = async (email, otp) => {
  // Ensure email is lowercased for consistent key generation
  const lowerEmail = email.toLowerCase();
  if (redisClient && redisClient.status === "ready") {
    const key = `otp:${lowerEmail}`;
    await redisClient.set(
      key,
      JSON.stringify({ otp, attempts: 0 }),
      "EX",
      OTP_EXPIRY
    );
    console.log(`OTP for ${lowerEmail} stored in Redis.`);
  } else {
    console.warn(
      `Redis not connected. OTP for ${lowerEmail}: ${otp} (In-memory/log fallback)`
    );
  }
};




// --- Verify OTP from Redis (or fallback) ---
const verifyOTP = async (email, providedOtp) => {
  const lowerEmail = email.toLowerCase();
  if (redisClient && redisClient.status === "ready") {
    const key = `otp:${lowerEmail}`;
    const data = await redisClient.get(key);
    if (!data)
      return {
        success: false,
        message: "OTP expired or not found. Please request a new one.",
        attemptsLeft: MAX_ATTEMPTS,
      };

    const { otp: storedOtp, attempts } = JSON.parse(data);

    if (attempts >= MAX_ATTEMPTS - 1) {
      // Check if this attempt will be the last one or exceed
      await redisClient.del(key); // Delete OTP after max attempts reached
      if (storedOtp !== providedOtp) {
        // if it's also the wrong OTP on the last attempt
        return {
          success: false,
          message:
            "Invalid OTP. Maximum attempts reached. Please request a new OTP.",
          attemptsLeft: 0,
        };
      }
      // If it's the correct OTP on the last allowed attempt, it will proceed to the next block.
    }

    if (storedOtp === providedOtp) {
      await redisClient.del(key); // Delete OTP after successful verification
      console.log(
        `OTP for ${lowerEmail} verified successfully and deleted from Redis.`
      );
      return { success: true, message: "OTP verified successfully." };
    } else {
      const newAttempts = attempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        await redisClient.del(key);
        return {
          success: false,
          message:
            "Invalid OTP. Maximum attempts reached. Please request a new OTP.",
          attemptsLeft: 0,
        };
      }
      await redisClient.set(
        key,
        JSON.stringify({ otp: storedOtp, attempts: newAttempts }),
        "EX",
        OTP_EXPIRY
      );
      console.log(
        `Invalid OTP for ${lowerEmail}. Attempt ${newAttempts} recorded.`
      );
      return {
        success: false,
        message: "Invalid OTP.",
        attemptsLeft: MAX_ATTEMPTS - newAttempts,
      };
    }
  } else {
    console.warn(
      `Redis not connected. Verifying OTP for ${lowerEmail} via fallback (will fail).`
    );
    return {
      success: false,
      message: "OTP service temporarily unavailable. Please try again later.",
      attemptsLeft: MAX_ATTEMPTS,
    };
  }
};

// @desc    Register/Create a new user account
// @route   POST /api/auth/register
router.post(
  "/register",
  [
    // Basic validation, add more as needed
    body("name", "Name is required").notEmpty().trim(),
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    body("roleToCreate", "Role for the new user is required").isIn([
      "student",
      "teacher",
      "superadmin",
    ]),
    // body('creatorRole').optional().isIn(['student', 'teacher', 'superadmin']) // Optional, for role-based creation
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/register endpoint was hit!"); // Debug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, roleToCreate } = req.body;
    const { creatorRole } = req.body; // Role of the person MAKING the request (SIMULATED)

    try {
      // --- Simulated Authorization for Creation (based on creatorRole) ---
      if (creatorRole) {
        const normalizedCreatorRole = creatorRole.toLowerCase();
        const normalizedRoleToCreate = roleToCreate.toLowerCase();

        if (normalizedCreatorRole === "superadmin") {
          if (
            normalizedRoleToCreate !== "teacher" &&
            normalizedRoleToCreate !== "superadmin"
          ) {
            return res.status(403).json({
              message:
                "Superadmin can only create teacher or other superadmin accounts.",
            });
          }
        } else if (normalizedCreatorRole === "teacher") {
          if (normalizedRoleToCreate !== "student") {
            return res
              .status(403)
              .json({ message: "Teacher can only create student accounts." });
          }
        } else if (normalizedCreatorRole === "student") {
          return res.status(403).json({
            message:
              "Students are not authorized to create accounts for others.",
          });
        }
        // No 'else' for invalid creatorRole, as validation handles it or it's ignored if not present
      } else {
        // No creatorRole provided - implies public registration, only for students
        if (roleToCreate.toLowerCase() !== "student") {
          return res.status(403).json({
            message: "Public registration is only allowed for students.",
          });
        }
      }
      // --- End Simulated Authorization ---

      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "Email address is already registered." });
      }

      const user = new User({
        name,
        email: email.toLowerCase(),
        password, // Hashing occurs via the pre-save hook in userModel
        role: roleToCreate.toLowerCase(),
      });
      await user.save();

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: `User account with role '${user.role}' created successfully.`,
      });
    } catch (err) {
      console.error("Registration Error:", err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation Error", errors: err.errors });
      }
      res.status(500).json({ message: "Server Error during registration" });
    }
  }
);

// @desc    Authenticate user & get user info (Login)
// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/login endpoint was hit!"); // Debug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid credentials (email not found)." });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid credentials (password incorrect)." });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Server Error during login" });
    }
  }
);

// @desc    Request Password Reset (Send OTP)
// @route   POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  [
    body("email", "Please enter a valid email address")
      .isEmail()
      .normalizeEmail(),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/forgot-password endpoint was hit!"); // Debug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.log(`Forgot password attempt for non-existent email: ${email}`);
        return res.status(200).json({
          message:
            "If an account with this email exists, a password reset OTP has been sent.",
        });
      }

      const otp = generateOTP();
      await storeOTP(email.toLowerCase(), otp); // storeOTP now lowercases email
      const emailSent = await sendOTPEmail(email.toLowerCase(), otp);

      if (emailSent) {
        res.status(200).json({
          message: `An OTP has been sent to ${email}. Please check your inbox.`,
        });
      } else {
        res
          .status(500)
          .json({ message: "Failed to send OTP email. Please try again." });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res
        .status(500)
        .json({ message: "Server error during password reset request." });
    }
  }
);

// @desc    Verify OTP for Password Reset
// @route   POST /api/auth/verify-otp
router.post(
  "/verify-otp",
  [
    body("email", "Email is required").isEmail().normalizeEmail(),
    body("otp", "OTP must be a 6-digit number")
      .isLength({ min: 6, max: 6 })
      .isNumeric(),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/verify-otp endpoint was hit!"); // Debug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    try {
      const verificationResult = await verifyOTP(email.toLowerCase(), otp); // verifyOTP now lowercases email

      if (verificationResult.success) {
        res.status(200).json({
          message: verificationResult.message,
          canResetPassword: true,
        });
      } else {
        res.status(400).json({
          message: verificationResult.message,
          attemptsLeft: verificationResult.attemptsLeft,
          canResetPassword: false,
        });
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      res
        .status(500)
        .json({ message: "Server error during OTP verification." });
    }
  }
);

// @desc    Reset Password after OTP verification
// @route   POST /api/auth/reset-password
router.post(
  "/reset-password",
  [
    body("email", "Email is required").isEmail().normalizeEmail(),
    // body('otp', 'Verified OTP token/proof is required').notEmpty(), // We'll rely on canResetPassword from client state for now
    body("newPassword", "New password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/reset-password endpoint was hit!"); // Debug
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // For this simplified flow, we are not re-validating the OTP here.
    // We assume the client only enables this call after a successful /verify-otp.
    // A more secure flow would involve a temporary, single-use token generated by /verify-otp.
    const { email, newPassword } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Cannot reset password." });
      }

      user.password = newPassword; // Mongoose pre-save hook will hash this
      await user.save();

      res.status(200).json({
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Server error during password reset." });
    }
  }
);

export default router;
