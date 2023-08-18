var config = require("../config/config.js");
const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    // res.status(403).send({
    //   message: "No token provided!",
    // });
    return res.redirect("/users/signin");
  }
  try {
    jwt.verify(token, config.secret, (err, decode) => {
      if(err){
        debug(err);
        req.session = null;
        return res.status(401).render("index", {
          title: "登录状态过期",
        });
      }
      if(decode.teacher){
        return  res.status(200).redirect("/teacher");
      }else{
        return  res.status(200).redirect("/student");
      }
    });
  } catch (err) {
    console.log(err);
    req.session = null;
    return res.redirect("/users/signin");
  }
};
