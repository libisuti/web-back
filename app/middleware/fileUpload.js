var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${getTime()}-${file.originalname}`);
  },
});
exports.upload = multer({ storage: storage });
