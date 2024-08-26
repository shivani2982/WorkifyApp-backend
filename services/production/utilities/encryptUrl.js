const crypto = require('crypto');

module.exports = (url, secretKey) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encryptedUrl = cipher.update(url, 'utf-8', 'hex');
  encryptedUrl += cipher.final('hex');
  return encodeURIComponent(encryptedUrl);
};