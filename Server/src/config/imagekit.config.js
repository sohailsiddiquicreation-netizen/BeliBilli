const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_40AtAi+Q8Z6d2tdo5yvONrCOPVo=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/YOUR_IMAGEKIT_ID"
});

module.exports = imagekit;
