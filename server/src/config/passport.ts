
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:5000/api/customer/auth/google/callback";

// Only enable Google login when both credentials are configured.
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
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google account did not provide an email"));
          }

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
          }

          return done(null, customer);
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

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as Express.User & { id: string }).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    done(null, customer || false);
  } catch (err) {
    done(err);
  }
});

export default passport;
