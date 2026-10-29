
import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt";
import { generateCustomerToken } from "../utils/customerJwt";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  (req, res) => {
    const account = req.user as
      | { id: string; role: string; accountType: "ADMIN" }
      | { id: string; accountType: "CUSTOMER" };

    if (!account?.id || !account.accountType) {
      res.status(401).send("Google authentication failed.");
      return;
    }

    const clientUrl = (
      process.env.CLIENT_URL || "http://localhost:5173"
    ).replace(/\/$/, "");

    // Admin accounts must use email and password.
    if (account.accountType === "ADMIN") {
      res.redirect(`${clientUrl}/login?error=google_admin_not_allowed`);
      return;
    }

    const token = generateCustomerToken(account.id);

    res.redirect(
      `${clientUrl}/customer/auth/success?token=${encodeURIComponent(token)}&type=CUSTOMER`
    );
  }
);
export default router;
