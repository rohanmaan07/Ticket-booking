const Movie = require("./models/Movies");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to Add movies..");
    return res.redirect("/login");
  }
  next();
};
module.exports.isLoggedinn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to show movie information..");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
    };
    next();
  };
  
  module.exports.isOwnwer=async(req,res,next)=>{
    let {id}=req.params;
    let movie=await Movie.findById(id);
    if(!movie.owner.equals(res.locals.currUser._id)){
      req.flash("success","You are not the owner of this listing.. ");
      return res.redirect(`/movies/${id}`);
    }
    next();
  }
  
