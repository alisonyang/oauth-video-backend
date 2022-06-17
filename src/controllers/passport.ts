import passport from 'passport';
import {User} from '../entity/User';
// import { IMongoDBUser } from '../types'
import dotenv from "dotenv";
dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user: any, done: any) => {
    console.log("serializeUser ing user:", user);
    return done(null, user.id);
  });
  
  passport.deserializeUser((id: string, done: any) => {
    console.log("deserializeUser ing id:", id);
    // User.findOne(id, (err: any, doc: any) => {
    //   // Whatever we return goes to the client and binds to the req.user property
    //   return done(null, doc);
    // })
    User.findOne({id})
      .then(
        (doc) => {
          console.log("load user id:", id);
          done( null, doc)
        });
  })
  
  
  passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
  },
    function (_: any, __: any, profile: any, cb: any) {
    User.findOne({ where: { googleId: profile.id } }).then(async (doc) => {
        
        if (doc) {
             console.log("old user hi:", doc);
               return cb(null, doc);
           }
           else {
             console.log("new user hi profile:");
             const googleId = profile.id;
             const username = profile.name.givenName;
            //  const email = profile.emails[0].value;
             console.log("{googleId, username}:", googleId, username)
             
             const user = User.create({ googleId, username});
 
             await user.save();  
             console.log("congrates! save new user!");
             return cb(null, user);
               
           }
       })
       .catch((err:Error) => {
           return cb(err, null);
         }); 
  
    }
    ));
  
    
    passport.use(new FacebookStrategy({
      clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
      callbackURL: "https://localhost:4000/auth/facebook/callback"
    },
    function (_: any, __: any, profile: any, cb: any) {
        User.findOne({ where: { facebookId: profile.id } }).then(async (doc) => {
        
            if (doc) {
                 console.log("old user hi:", doc);
                   return cb(null, doc);
               }
               else {
                 console.log("new user hi profile:", profile);
                 const facebookId = profile.id;
                 const username = profile.displayName;
                 const user = User.create({ facebookId, username});
     
                 await user.save();  
                 console.log("congrates! save new user!");
                 return cb(null, user);
                   
               }
           })
           .catch((err:Error) => {
               return cb(err, null);
             }); 
  
    //   User.findOne({ facebookId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
  
    //     if (err) {
    //       return cb(err, null);
    //     }
  
    //     if (!doc) {
    //       console.log("profile:", profile);
    //       const newUser = new User({
    //         facebookId: profile.id,
    //         username: profile.displayName
    //       });
  
    //       await newUser.save();
    //       return cb(null, newUser);
    //     }
    //     return cb(null, doc);
    //   })
  
    }
  )); 