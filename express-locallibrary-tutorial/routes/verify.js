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
    const userid = jwt.verify(token, config.secret);
    req.userid = userid;
    //console.log("req.userid "+ userid);
    next();//验证成功
  } catch (err) {
    console.log(err);
    req.session = null;
    return res.redirect("/users/signin");
  }
};
