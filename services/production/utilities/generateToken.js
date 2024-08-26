const jwt = require('jsonwebtoken');

module.exports = (user) => ({
  token: 'Bearer ' + jwt.sign({ id: user.useraccount_id, role:user.user_account.role_id, fcmToken: user.user_account.fcmToken },
   "secret"),user
  });