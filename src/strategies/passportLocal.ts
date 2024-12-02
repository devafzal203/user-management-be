import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma.client";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma?.user.findUnique({ where: { email } });
        if (!user || !user.password)
          return done(null, false, { message: "Invalid credentials" });

        const isMatch =
          user.password && (await bcrypt.compare(password, user.password));
        if (!isMatch) return done(null, false, { message: "Invalid password" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
