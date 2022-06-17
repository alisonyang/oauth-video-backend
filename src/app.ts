import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
require('./controllers/passport.ts');

const app = express();

// Middleware
app.use(express.json());
// app.use(cors({ origin: "https://stirring-mooncake-f0cdcf.netlify.app", credentials: true }))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))


app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  // passport.authenticate('google', { failureRedirect: 'https://stirring-mooncake-f0cdcf.netlify.app', session: true }),
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    // res.redirect('https://stirring-mooncake-f0cdcf.netlify.app');
    res.redirect('http://localhost:3000');
  });


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  // passport.authenticate('google', { failureRedirect: 'https://stirring-mooncake-f0cdcf.netlify.app', session: true }),
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    // res.redirect('https://stirring-mooncake-f0cdcf.netlify.app');
    res.redirect('http://localhost:3000');
  });


app.get("/", (req, res) => {
  res.send("Helllo WOlrd");
})

app.get("/getuser", (req, res) => {
  res.send(req.user);
})

app.get("/auth/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
})

// app.listen(process.env.PORT || 4000, () => {
//   console.log("Server Starrted");
// })


export default app;
