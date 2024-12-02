import passport from "passport";
import "./passportLocal";
import "./passportGoogle";

// Serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma?.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
