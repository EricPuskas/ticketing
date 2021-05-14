import express from "express";

const router = express.Router();

router.post("/api/users/logout", (req, res) => {
  req.session = null;
  res.status(200).json({ status: "ok" });
});

export { router as logoutRouter };
