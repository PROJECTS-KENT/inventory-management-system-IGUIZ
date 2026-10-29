
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  "https://keyverse-api-80o8.onrender.com/api/customer/auth/google/callback";

if (googleClientID && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const emailEntry = profile.emails?.[0];
          const email = emailEntry?.value?.trim().toLowerCase();

          if (!email || emailEntry?.verified === false) {
            return done(null, false);
          }

          // Existing admin accounts only; Google cannot create admins.
          const admin = await prisma.user.findUnique({
            where: { email },
          });

          if (admin) {
            if (!admin.isActive || admin.role !== "ADMIN") {
              return done(null, false);
            }

            return done(null, {
              id: admin.id,
              role: admin.role,
              accountType: "ADMIN",
            });
          }

          // Otherwise, sign in or create a customer.
          let customer = await prisma.customer.findUnique({
            where: { email },
          });

          if (!customer) {
            customer = await prisma.customer.create({
              data: {
                name: profile.displayName,
                email,
                googleId: profile.id,
              },
            });
          } else if (!customer.googleId) {
            customer = await prisma.customer.update({
              where: { id: customer.id },
              data: { googleId: profile.id },
            });
          } else if (customer.googleId !== profile.id) {
            return done(null, false);
          }

          return done(null, {
            id: customer.id,
            accountType: "CUSTOMER",
          });
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );

  console.log("Google OAuth is enabled.");
} else {
  console.log(
    "Google OAuth is disabled because its credentials are not configured."
  );
}

export default passport;
