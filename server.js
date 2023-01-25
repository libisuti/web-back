const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");
const db = require("./app/models");
const Role = db.role;

const employeeRoutes = require("./app/routes/employee");

const app = express();
// connection for mongoose
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// phần dành cho đọc và truy cập thư  mục ảnh
global.__basedir = __dirname;
const initRoutes = require("./app/routes");

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:8081"],
  })
);

// phân tích các yêu cầu của loại nội dung - application/json
app.use(express.json());

//  phân tích các yêu cầu của loại nội dung - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
app.use(
  cookieSession({
    name: "duy-session",
    secret: "COOKIE_SECRET", // nên sử dụng làm biến môi trường bí mật
    httpOnly: true,
  })
);

app.use(`${dbConfig.API}/accounts`, employeeRoutes);
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// function initial
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
