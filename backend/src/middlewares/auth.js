import admin from "../config/firebase.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email || null,
        displayName: decoded.name || "",
        photoURL: decoded.picture || "",
        providers: decoded.firebase?.identities
          ? Object.keys(decoded.firebase.identities).map((key) => ({
              providerId: key,
              uid: decoded.firebase.identities[key][0],
            }))
          : [],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};