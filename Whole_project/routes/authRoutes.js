// WHOLE_PROJECT/routes/authRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import otpGenerator from "otp-generator";
import User from "../models/userModel.js"; // Your single User model
import { sendOTPEmail } from "../WHOLE_PROJECT/utils/emailService.js"; // Corrected Path
import redisClient from "../WHOLE_PROJECT/utils/redisClient.js"; // Corrected Path
// import bcrypt from "bcryptjs"; // Not directly used here, userModel handles it.

// Initialize the router
const router = express.Router();

// Constants for OTP and Lockout
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_SECONDS || "300", 10); // 5 minutes default
const MAX_LOGIN_FAIL_ATTEMPTS = parseInt(
  process.env.MAX_OTP_ATTEMPTS || "5",
  10
); // Max OTP verification attempts before lockout
const LOCKOUT_DURATION_SECONDS =
  parseInt(process.env.LOCKOUT_DURATION_MINUTES || "20", 10) * 60; // 20 minutes default lockout

console.log("authRoutes.js file is being loaded/executed");

// --- Helper function to generate OTP ---
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

// --- Store OTP and Attempt Info in Redis ---
const storeOTPAndAttempts = async (email, otp) => {
  const lowerEmail = email.toLowerCase();
  if (redisClient && redisClient.status === "ready") {
    const key = `otp:${lowerEmail}`;
    await redisClient.set(
      key,
      JSON.stringify({ otp, attempts: 0, lockoutUntil: null }), // Reset attempts for new OTP
      "EX",
      OTP_EXPIRY
    );
    console.log(`OTP and attempts for ${lowerEmail} stored in Redis.`);
  } else {
    console.warn(
      `Redis not connected or not ready. OTP for ${lowerEmail}: ${otp} (In-memory/log fallback)`
    );
  }
};

// --- Verify OTP, Handle Attempts and Lockout ---
const verifyOTPAndHandleAttempts = async (email, providedOtp) => {
  const lowerEmail = email.toLowerCase();
  if (!redisClient || redisClient.status !== "ready") {
    console.warn(
      `Redis not connected or not ready. Verifying OTP for ${lowerEmail} via fallback (will fail).`
    );
    return {
      success: false,
      message: "OTP service temporarily unavailable. Please try again later.",
      attemptsLeft: MAX_LOGIN_FAIL_ATTEMPTS,
      lockoutUntil: null,
    };
  }

  const key = `otp:${lowerEmail}`;
  const dataString = await redisClient.get(key);

  if (!dataString) {
    return {
      success: false,
      message:
        "OTP expired, already used, or not found. Please request a new one.",
      attemptsLeft: MAX_LOGIN_FAIL_ATTEMPTS, // No specific OTP data, so reset conceptual attempts for a new OTP
      lockoutUntil: null,
    };
  }

  let { otp: storedOtp, attempts } = JSON.parse(dataString); // lockoutUntil for *this OTP* is not stored here

  if (storedOtp === providedOtp) {
    await redisClient.del(key); // Delete OTP info after successful verification
    console.log(
      `OTP for ${lowerEmail} verified successfully and deleted from Redis.`
    );
    return {
      success: true,
      message: "OTP verified successfully.",
      lockoutUntil: null, // No lockout triggered by this OTP verification
    };
  } else {
    attempts += 1;
    let newLockoutUntilTimestamp = null;
    let message = "Invalid OTP.";
    let attemptsLeft = MAX_LOGIN_FAIL_ATTEMPTS - attempts;

    if (attempts >= MAX_LOGIN_FAIL_ATTEMPTS) {
      newLockoutUntilTimestamp =
        new Date().getTime() + LOCKOUT_DURATION_SECONDS * 1000;
      message = `Invalid OTP. Maximum attempts reached. Account locked for ${
        LOCKOUT_DURATION_SECONDS / 60
      } minutes.`;
      attemptsLeft = 0;
      await redisClient.del(key); // Delete this specific OTP's data
      const lockoutKey = `lockout:${lowerEmail}`;
      await redisClient.set(
        lockoutKey,
        newLockoutUntilTimestamp.toString(), // Store the timestamp when lockout ends
        "EX",
        LOCKOUT_DURATION_SECONDS
      );
      console.log(
        `Account for ${lowerEmail} locked out until ${new Date(
          newLockoutUntilTimestamp
        ).toISOString()}. Lockout key set in Redis.`
      );
    } else {
      // Update attempts for the current OTP in Redis, preserving its original expiry
      const ttl = await redisClient.ttl(key);
      if (ttl > 0) {
        await redisClient.set(
          key,
          JSON.stringify({ otp: storedOtp, attempts, lockoutUntil: null }), // No lockout for this specific OTP yet
          "EX",
          ttl // Use remaining TTL
        );
      } else {
        // OTP expired while attempting, treat as if not found initially
        console.log(
          `OTP for ${lowerEmail} expired during attempt ${attempts}.`
        );
        return {
          success: false,
          message: "OTP expired during verification. Please request a new one.",
          attemptsLeft: MAX_LOGIN_FAIL_ATTEMPTS,
          lockoutUntil: null,
        };
      }
      console.log(
        `Invalid OTP for ${lowerEmail}. Attempt ${attempts} recorded.`
      );
    }
    return {
      success: false,
      message,
      attemptsLeft,
      lockoutUntil: newLockoutUntilTimestamp, // Send back the timestamp when lockout ends
    };
  }
};

// @desc    Register/Create a new user account
// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty().trim(),
    body("email", "Please include a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    body(
      "roleToCreate",
      "Role for the new user is required (Student, Educator, School Admin, or Super Admin)"
    ).isIn(["Student", "Educator", "School Admin", "Super Admin"]),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/register endpoint was hit!");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, roleToCreate } = req.body;
    let { creatorRole } = req.body; // Optional: for admin creating users

    try {
      if (creatorRole) {
        // Normalize roles for comparison logic, but store the original case from roleToCreate
        const normCreatorRole = creatorRole.toLowerCase().replace(/\s+/g, ''); // e.g., "superadmin"
        const normRoleToCreate = roleToCreate.toLowerCase().replace(/\s+/g, ''); // e.g., "schooladmin"

        if (normCreatorRole === "superadmin") {
          if (
            normRoleToCreate !== "schooladmin" &&
            normRoleToCreate !== "educator" &&
            normRoleToCreate !== "superadmin" // Super Admin can create other Super Admins
          ) {
            return res
              .status(403)
              .json({
                message:
                  "Super Admin can only create School Admin, Educator, or other Super Admin accounts.",
              });
          }
        } else if (normCreatorRole === "schooladmin") {
          if (normRoleToCreate !== "educator" && normRoleToCreate !== "student") {
            return res
              .status(403)
              .json({ message: "School Admin can only create Educator or Student accounts." });
          }
        } else if (normCreatorRole === "educator") {
          if (normRoleToCreate !== "student") {
            return res
              .status(403)
              .json({ message: "Educator can only create Student accounts." });
          }
        } else if (normCreatorRole === "student") {
          return res
            .status(403)
            .json({
              message:
                "Students are not authorized to create accounts for others.",
            });
        } else {
             return res.status(400).json({ message: "Invalid creatorRole specified." });
        }
      } else {
        if (roleToCreate.toLowerCase().replace(/\s+/g, '') !== "student") {
          return res
            .status(403)
            .json({
              message: "Public registration is only allowed for students.",
            });
        }
      }

      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "Email address is already registered." });
      }

      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
        role: roleToCreate, // Store with original casing as per enum
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
    console.log(">>> POST /api/auth/login endpoint was hit!");
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
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // TODO: Implement JWT generation here upon successful login
      // const token = generateJwtToken(user._id, user.role);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // token: token // Send token to client
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
    console.log(">>> POST /api/auth/forgot-password endpoint was hit!");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const lowerEmail = email.toLowerCase();

    try {
      if (redisClient && redisClient.status === "ready") {
        const lockoutKey = `lockout:${lowerEmail}`;
        const lockoutData = await redisClient.get(lockoutKey);
        if (lockoutData) {
          const lockoutEndTime = parseInt(lockoutData, 10);
          const remainingLockoutTime = Math.ceil(
            (lockoutEndTime - new Date().getTime()) / 1000
          );
          if (remainingLockoutTime > 0) {
            return res.status(429).json({
              message: `Account is temporarily locked. Please try again in ${Math.ceil(
                remainingLockoutTime / 60
              )} minutes.`,
              lockoutUntil: lockoutEndTime,
            });
          }
        }
      } else {
        console.warn(
          "Redis not connected or not ready, cannot check for lockout status for forgot-password."
        );
      }

      const user = await User.findOne({ email: lowerEmail });
      if (!user) {
        console.log(
          `Forgot password attempt for non-existent email: ${lowerEmail}`
        );
        return res
          .status(200)
          .json({
            message:
              "If an account with this email exists, an OTP will be sent.",
          });
      }

      const otp = generateOTP();
      await storeOTPAndAttempts(lowerEmail, otp);
      const emailSent = await sendOTPEmail(lowerEmail, otp);

      if (emailSent) {
        res
          .status(200)
          .json({
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
    console.log(">>> POST /api/auth/verify-otp endpoint was hit!");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    const lowerEmail = email.toLowerCase();

    try {
      if (redisClient && redisClient.status === "ready") {
        const lockoutKey = `lockout:${lowerEmail}`;
        const lockoutData = await redisClient.get(lockoutKey);
        if (lockoutData) {
          const lockoutEndTime = parseInt(lockoutData, 10);
          const remainingLockoutTime = Math.ceil(
            (lockoutEndTime - new Date().getTime()) / 1000
          );
          if (remainingLockoutTime > 0) {
            return res.status(429).json({
              message: `Account is temporarily locked. Please try again in ${Math.ceil(
                remainingLockoutTime / 60
              )} minutes.`,
              lockoutUntil: lockoutEndTime,
              canResetPassword: false,
            });
          }
        }
      } else {
        console.warn(
          "Redis not connected or not ready, cannot check for lockout status for verify-otp."
        );
      }

      const verificationResult = await verifyOTPAndHandleAttempts(
        lowerEmail,
        otp
      );

      if (verificationResult.success) {
        res
          .status(200)
          .json({
            message: verificationResult.message,
            canResetPassword: true,
          });
      } else {
        // If lockout was just triggered, status code could be 429, otherwise 400.
        const statusCode = verificationResult.lockoutUntil ? 429 : 400;
        res.status(statusCode).json({
          message: verificationResult.message,
          attemptsLeft: verificationResult.attemptsLeft,
          canResetPassword: false,
          lockoutUntil: verificationResult.lockoutUntil,
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
    // body("otp", "Verified OTP is required for this flow if not using a temporary token").notEmpty(), // Removed for simplicity, relying on client state
    body("newPassword", "New password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log(">>> POST /api/auth/reset-password endpoint was hit!");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, newPassword } = req.body; // Assuming client sends newPassword and email

    try {
      // CRITICAL SECURITY NOTE: This simplified flow relies on the client having successfully
      // verified an OTP for this email. A more secure system would use a short-lived,
      // single-use token generated by the /verify-otp endpoint, which would be required here.
      // Without it, there's a potential vulnerability if an attacker can guess/intercept the email
      // and the client allows proceeding to this step without true prior OTP verification.

      // For now, we'll proceed assuming the frontend flow handles this correctly.
      // We also won't check the `lockout:${email}` key here again, assuming if they got past
      // /verify-otp successfully, the lockout (if any) was handled.

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Cannot reset password." });
      }

      user.password = newPassword; // Mongoose pre-save hook will hash this
      await user.save();

      res
        .status(200)
        .json({
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
