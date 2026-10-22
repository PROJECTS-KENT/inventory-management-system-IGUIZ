import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";
import { generateToken } from "../utils/jwt";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        "http://localhost:5000/api/customer/auth/google/callback",
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let customer = await prisma.customer.findUnique({
          where: {
            email: profile.emails?.[0].value,
          },
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0].value!,
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

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    done(null, customer);
  } catch (err) {
    done(err);
  }
});

export default passport;