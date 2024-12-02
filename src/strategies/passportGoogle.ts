import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../database/prisma.client";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma?.user.findFirst({
          where: {
            OR: [
              { providerId: profile.id },
              { email: profile.emails?.[0].value },
            ],
          },
        });
        if (!user) {
          user = await prisma?.user.create({
            data: {
              email: profile.emails![0].value,
              fullName: profile.displayName,
              avatarUrl: profile.photos?.[0].value,
              provider: "google",
              providerId: profile.id,
            },
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
