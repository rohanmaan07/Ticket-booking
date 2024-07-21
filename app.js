if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const initData = require("./init/data.js");
const Movie = require("./models/Movies");
const Booking=require("./models/Booking.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/WrapAsync.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer=require("multer");
const {storage}=require("./cloudConfig.js");
const upload=multer({storage});
// const upload=multer({dest:'uploads/'})
const User = require("./models/User.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const {isLoggedin, saveRedirectUrl, isOwnwer,isLoggedinn}=require("./middleware.js");

const dbUrl=process.env.ATLAS_URL;

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600, 
});

store.on("error",()=>{
  console.log("Error in mongo session Store",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// Middleware
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// Session and Flash
app.use(session(sessionOptions));
app.use(flash());

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set flash messages to response locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser=req.user;
  next();
});

// Database Connection
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

// Server Listening
app.listen(3000, () => {
  console.log("server was listening on the 3000 port..");
});

// Validate ObjectId Middleware
const { Types } = require("mongoose");
function validateObjectId(req, res, next) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return next(new ExpressError(400, "Invalid ID"));
  }
  next();
}

// Routes
app.get("/", (req, res) => {
  res.send("working");
});

// Demo user
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "rohan@gmail.com",
//     username: "rohanmaan",
//   });
//   let registeredUser = await User.register(fakeUser, "1234");
//   res.send(registeredUser);
// });

// Movies Routes
app.get("/movies", wrapAsync(async (req, res) => {
  let movies = await Movie.find();
  res.render("index.ejs", { movies });
}));

app.get("/movies/new", isLoggedin, (req, res) => {
  res.render("new.ejs");
});

app.get("/movies/:id",isLoggedinn, validateObjectId, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const movies = await Movie.findById(id).populate('owner');
  res.render("show.ejs", { movies });
}));

app.post("/movies", isLoggedin, upload.single("url"),wrapAsync(async (req, res) => {
  let url=req.file.path;
  let filename=req.file.name;
  
  const newMovie = new Movie({
    title: req.body.title,
    description: req.body.description,
    actors: req.body.actors,
    url: req.body.url,
    releaseDate: req.body.releaseDate,
    price: req.body.price,
  });
  newMovie.owner=req.user._id;
  newMovie.url={url,filename};
  await newMovie.save();
  res.redirect("/movies");
}));

app.get("/movies/:id/edit", isLoggedinn,isOwnwer, validateObjectId, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const movies = await Movie.findById(id);
  res.render("edit.ejs", { movies });
}));

app.put("/movies/:id", isLoggedin, upload.single("url"), isOwnwer, validateObjectId, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let { title, description, actors, releaseDate, price, existingUrl, existingFilename } = req.body;
  console.log('File:', req.file); // Check if file is received
  console.log('Body:', req.body);
  let url, filename;
  if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
  } else {
      url = existingUrl;
      filename = existingFilename;
  }

  await Movie.findByIdAndUpdate(
    id,
    { title, description, actors, url: { url, filename }, releaseDate, price },
    { runValidators: true, new: true }
  );

  res.redirect(`/movies/${id}`);
}));


app.delete("/movies/:id",isLoggedin,isOwnwer, validateObjectId, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Movie.findByIdAndDelete(id);
  res.redirect("/movies");
}));

//SignUp user
app.get("/signup",(req,res)=>{
  res.render("user/signup.ejs");
})

app.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next (err);
      }
      req.flash("success", "Successfully registered! Welcome!");
      res.redirect("/movies");
    })
    
  } catch (e) {
    if (e.name === 'UserExistsError') {
      req.flash("error", "Username already exists. Please choose a different username.");
    } else {
      req.flash("error", e.message);
    }
    res.redirect("/signup");
  }
}));

//login
app.get("/login",(req,res)=>{
  res.render("user/login.ejs");
})

app.post("/login",saveRedirectUrl,
  passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), async(req,res)=>{
  req.flash("success","Welcome back to the TicketBooking");
  const redirectUrl = res.locals.redirectUrl || "/movies"; // Default to /movies if redirectUrl is not set
  res.redirect(redirectUrl);

} );

//logout
app.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out");
    res.redirect("/movies");
  })
})

//booking routes

// Route to show user's bookings
app.get('/mybookings', isLoggedin, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('movie');
  res.render('bookings/booking.ejs', { bookings });
});

app.post('/mybookings', isLoggedin, async (req, res) => {
  const { seatNumber, date } = req.body;
  const movieId = req.body.movieId; // Assuming you pass movieId in the form

  const booking = new Booking({
      seatNumber,
      date,
      movie: movieId,
      user: req.user._id
  });

  await booking.save();
  req.flash("success","Your booking is confirmed");
  res.redirect("/movies");
});

app.delete('/bookings/:id', isLoggedin, validateObjectId, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking deleted successfully");
  res.redirect("/mybookings");
}));

//about page 
app.get('/about', (req, res) => {
  res.render('includes/about');
});

// ExpressErrorcl
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found!!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

