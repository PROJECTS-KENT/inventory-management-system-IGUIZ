import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt";
import { generateCustomerToken } from "../utils/customerJwt";

import {
  login,
  register,
} from "../controllers/customerAuth.controller";

const router = Router();


/*
Google Authentication
*/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req: any, res) => {
    const customer = req.user;

    const token = generateCustomerToken(customer.id);

   const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

res.redirect(
  `${clientUrl.replace(/\/$/, "")}/customer/auth/success?token=${token}`
);
  }
);

export default router;