const prodConfig = {
  secretKey: `86(23494-)8923-flick-489SU((*&uih`,
  mongoUrl: `mongodb://localhost:27017/flick-db`,
  port:3000,
  jwtSecret: `flick(!@$#^IsAwesome`,
  s3: {
    accessKeyId: ``,
    secretAccessKey: ``,
    region: `eu-west-1`
  },
  endPoint: {
    apiUrl: `http://127.0.0.1:3000/api/`,
    publicPath: `http://127.0.0.1:3000/`
  }
};
module.exports = prodConfig;