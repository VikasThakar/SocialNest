import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    console.log("Auth Token Found");
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log("Auth Error: User not found in DB");
        return res.status(401).json({ message: "User not found" });
      }
      console.log("Auth Success: User", req.user.username);
      next();
    } catch (error) {
      console.error("Auth Token Error:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    console.log("Auth Error: No token provided");
    res.status(401).json({ message: "No token" });
  }
};

export default protect;
