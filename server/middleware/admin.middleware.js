/*
 * Middleware to check if user has admin role
 * Should be used AFTER authentication middleware
 */

export const isAdmin = (req, res, next) => {
  try {
    // check is user is authenticated :
    console.log("user", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required!",
      });
    }

    // check is user has admin role :
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // if user is admin proceed to next middlware route handler :
    next();
  } catch (error) {
    console.error("admin middlware error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
