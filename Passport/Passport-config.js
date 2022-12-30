import { Strategy } from "passport-google-oauth2";
import { User } from "../database/Sequelize.js";
import password from "secure-random-password";
const PassportConfig = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID: '762918913553-k93q27o0tko30m02jp1ursthcmsp4rbk.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "https://autogoback237.herokuapp.com/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        User.findOne({ where :{ "email": profile.emails[0].value} }).then((user) => {
          if (user) {
            return done(null, user);
          } else {
            console.log("Creating new user...");
            console.log(profile)
            User.create({
              nom: profile.given_name,
              prenom: profile.family_name,
              email: profile.emails[0].value,
              photo : profile.picture,
              password: password.randomPassword(),
              status: 0,
              phone: "",
              birthDate: "",
            })
              .then((user) => done(null, user))
              .catch((error) => {
                done(error, false);
              });
          }
        });
      }
    )
  );
};

export default PassportConfig;
