import { Strategy } from "passport-google-oauth2";
import { User } from "../database/Sequelize.js";
import password from "secure-random-password";
import { config } from "dotenv";

config()

const PassportConfig = (passport) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
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
