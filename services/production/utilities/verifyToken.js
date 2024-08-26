const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  if (!token) {
    return { status: 404, message: "no token" };
  }

  return await jwt.verify(token, "secret", function (err, decoded) {
    if (err) {
      console.log(err);
      const error = { status: 404, message: err };
      return error;
    } else {
      const decode = { status: 200, user: decoded };
      return decode;
    }
  });
};
module.exports = verifyToken;
