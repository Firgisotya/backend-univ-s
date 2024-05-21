var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { addApiPrefix } = require("./utils/AddPrefix");
const port = 3000;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var remindersRouter = require("./routes/reminders");
var postsRouter = require("./routes/posts");
var commentsRouter = require("./routes/comments");
var reportedCommentsRouter = require("./routes/reportedComments");
var reportedPostsRouter = require("./routes/reportedPosts");
var examsRouter = require("./routes/exams");

var { authMiddleware } = require("./middleware/auth");

var cors = require("cors");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use(addApiPrefix("/users"), authMiddleware, usersRouter);
app.use(addApiPrefix("/auth"), authRouter);
app.use(addApiPrefix("/reminders"), authMiddleware, remindersRouter);
app.use(addApiPrefix("/posts"), authMiddleware, postsRouter);
app.use(addApiPrefix("/comments"), authMiddleware, commentsRouter);
app.use(addApiPrefix("/exams"), authMiddleware, examsRouter);
app.use(
  addApiPrefix("/report-comment"),
  authMiddleware,
  reportedCommentsRouter
);
app.use(addApiPrefix("/report-post"), authMiddleware, reportedPostsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
