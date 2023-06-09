if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passportStudent = require("passport");
const passportFaculty = require("passport");
const cors = require("cors");
// const popup = require("popups");

const initializePassportStudent = require("./passport-config-student.js");
const initializePassportFaculty = require("./passport-config-faculty.js");

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://kushuchiha358:yja2tLWHU1GlSFx0@cluster0.8nxusvu.mongodb.net/test",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("DB connected");
  });

initializePassportStudent(
  passportStudent,
  (email) => Student.findOne({ email: email }),
  (id) => id
);

initializePassportFaculty(
  passportFaculty,
  (email) => Faculty.findOne({ email: email }),
  (id) => id
);
app.use(cors());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passportStudent.initialize());
app.use(passportStudent.session());
const StudentSchema = {
  student_ID: String,
  name: String,
  gender: String,
  date_Of_Birth: Date,
  email: String,
  password: String,
};

const StudentSubSchema = {
  stu_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  course_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  midsem1: Number,
  midsem2: Number,
  endsem: Number,
  attendance: Number,
  feedback: String,
};

const BroadcastSchema = {
  broadcasts: String,
  date_Of_Broadcast: Date,
  time_Of_Broadcast: Date,
};

app.use(passportFaculty.initialize());
app.use(passportFaculty.session());
const FacultySchema = {
  email: String,
  password: String,
  faculty_ID: Number,
  name: String,
  gender: String,
  alma_Mater: String,
  date_Of_Joining: String,
};

const FacultySubSchema = {
  fac_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  course_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
  fac_Course_Link: String,
  midsem1: [Number],
  midsem2: [Number],
  endsem: [Number],
};
const CoursesSchema = {
  name: String,
  semester: Number,
  credits: Number,
  code: String,
};
const Student = mongoose.model("Student", StudentSchema);
// const preStudent = mongoose.model("preStudent", GlobalSchema);
const Faculty = mongoose.model("Faculty", FacultySchema);
// const preFaculty = mongoose.model("preFaculty", FacultySchema);
const Broadcast = mongoose.model("Broadcast", BroadcastSchema);

const FacultySub = mongoose.model("FacultySub", FacultySubSchema);

const StudentSub = mongoose.model("StudentSub", StudentSubSchema);

const Courses = mongoose.model("Courses", CoursesSchema);

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// const date = new Date();
// const kush = new Student({
//   student_ID: "202001104",
//   name: "Kush",
//   gender: "Male",
//   date_Of_Birth: new Date(),
//   email: "202001104@daiict.ac.in",
//   password: "hello",
// });

// const Abhimanyu = new Student({
//   student_ID: "202001080",
//   name: "Abhimanyu",
//   gender: "Male",
//   date_Of_Birth: new Date(),
//   email: "202001080@daiict.ac.in",
//   password: "hello",
// });
// const prof1 = new Faculty({
//   email: "kushshah358@gmail.com",
//   password: "123",
//   faculty_ID: 1,
//   name: "Kush Shah",
//   gender: "male",
//   alma_Mater: "DAIICT",
//   date_Of_Joining: "04.05.2017",
// });

// const course3 = new Courses({
//   name: "Software Engineering",
//   semester: 3,
//   credits: 4.5,
//   code: "IT234",
// });

// const course4 = new Courses({
//   name: "Cryptography",
//   semester: 3,
//   credits: 4,
//   code: "SC402",
// });
// const course5 = new Courses({
//   name: "Economics",
//   semester: 3,
//   credits: 3,
//   code: "HM404",
// });

// const course6 = new Courses({
//   name: "HCI",
//   semester: 3,
//   credits: 4,
//   code: "IE314",
// });

// const course7 = new Courses({
//   name: "OS",
//   semester: 3,
//   credits: 4.5,
//   code: "IT414",
// });

// course3.save();
// course4.save();
// course5.save();
// course6.save();
// course7.save();

// const course2 = new Courses({
//   name: "C++",
//   semester: 1,
//   credits: 4,
//   code: "IT420",
// });

// course1.save();
// course2.save();
// Student.findOne({ _id: "6446110514f2b404b9f14e7b" }).then((student) => {
//   Courses.findOne({ _id: "6448bf06254eb9324064a667" }).then((course) => {
//     const kush_course1 = new StudentSub({
//       stu_Name: student,
//       course_Name: course,
//       midsem1: 7,
//       midsem2: 12,
//       endsem: 17,
//       feedback: "temp",
//     });
//     kush_course1.save();
//   });
// });

// Faculty.findOne({ _id: "644508decf5610c643344c39" }).then((faculty) => {
//   Courses.findOne({ _id: "6448bf06254eb9324064a667" }).then((course) => {
//     const kush_course2 = new FacultySub({
//       fac_Name: faculty,
//       course_Name: course,
//       fac_Course_Link: "www.youtube.com",
//       midsem1: [7, 5, 10],
//       midsem2: [12, 10, 15],
//       endsem: [17, 10, 20],
//     });
//     kush_course2.save();
//   });
// });

// Abhimanyu.save();
// prof1.save();

Faculty.find({}).then((faculty) => {
  if (faculty.length == 0) prof1.save();
});
Student.find({}).then((Students) => {
  if (Students.length == 0) kush.save();
});

// const naruto = new Item({
//   name: "naruto",
// });
// const sasuke = new Item({
//   name: "sasuke",
// });
// const defaultnames = [kush];
const saltRounds = 10;
app.use(express.static("public"));

app.get("/signup", function (req, res) {
  res.render("signup.ejs");
});

app.get("/faculty", function (req, res) {
  res.render("Faculty_Login.ejs");
});

app.get("/Admin_Login", function (req, res) {
  res.render("Admin_Login.ejs");
});

app.get("/Admin_Home", function (req, res) {
  res.render("Admin_Home.ejs");
});

app.get("/Student_Home", checkAuthenticatedStudent, (req, res) => {
  res.render("Student_Home");
});

app.get(
  "/Student_Home_Login",
  checkNotAuthenticatedStudent,
  function (req, res) {
    res.render("Student_Home_Login.ejs");
  }
);

app.get("/Faculty_Login", checkNotAuthenticatedFaculty, function (req, res) {
  res.status(200).render("Faculty_Login.ejs");
});

app.get("/Faculty_Home", checkAuthenticatedFaculty, (req, res) => {
  res.status(205).render("Faculty_Home.ejs");
});

app.get("/Faculty_Info", checkAuthenticatedFaculty, (req, res) => {
  Faculty.findOne({ _id: req.user }).then((faculty) => {
    res.render("Faculty_Info.ejs", { faculty });
  });
});

app.get("/Faculty_Sub_Info", checkAuthenticatedFaculty, (req, res) => {
  FacultySub.find({ fac_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((faculty) => {
      //console.log(faculty);
      res.render("Faculty_Sub_Info.ejs", { faculty });
    });
});

app.get("/Student_Sub_Info", checkAuthenticatedFaculty, (req, res) => {
  StudentSub.find({ stu_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((student) => {
      //console.log(faculty);
      res.render("Student_Sub_Info.ejs", { student });
    });
});

app.get("/Forgot_Pswd", function (req, res) {
  res.render("Forgot_Pswd.ejs");
});

app.get("/Faculty_Forgot_Pswd", function (req, res) {
  res.render("Faculty_Forgot_Pswd.ejs");
});

app.get("/Student_Attendance", checkAuthenticatedStudent, (req, res) => {
  StudentSub.find({ stu_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      //console.log(faculty);
      res.render("Student_Attendance.ejs", { StuSub });
    });
});

app.get("/Student_Feedback", checkAuthenticatedStudent, (req, res) => {
  StudentSub.find({ stu_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      //console.log(faculty);
      res.render("Student_Feedback.ejs", { StuSub });
    });
});

app.get("/Student_Grade_Tracking", checkAuthenticatedStudent, (req, res) => {
  StudentSub.find({ stu_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      // console.log(StuSub);
      FacultySub.find({
        course_Name: { $in: StuSub.map((s) => s.course_Name) },
      })
        .populate("course_Name")
        .exec()
        .then((FacSub) => {
          // console.log(FacSub);
          res.render("Student_Grade_Tracking.ejs", { StuSub, FacSub });
        });
    });
});

app.get("/Student_Resources", checkAuthenticatedStudent, (req, res) => {
  StudentSub.find({ stu_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      // console.log(StuSub);
      FacultySub.find({
        course_Name: { $in: StuSub.map((s) => s.course_Name) },
      })
        .populate("course_Name")
        .exec()
        .then((FacSub) => {
          // console.log(FacSub);
          res.render("Student_Resources.ejs", { StuSub, FacSub });
        });
    });
});

app.get("/Faculty_Resources", checkAuthenticatedFaculty, function (req, res) {
  FacultySub.find({ fac_Name: req.user })
    .populate("course_Name")
    .exec()
    .then((faculty) => {
      //console.log(faculty);
      res.render("Faculty_Resources.ejs", { faculty });
    });
});
// app.get("/Faculty_Sub_Report", checkAuthenticatedFaculty, (req, res) => {
//   FacultySub.find({ fac_Name: req.user })
//     .populate("course_Name")
//     .exec()
//     .then((faculty) => {
//       //console.log(faculty);
//       res.render("Faculty_Sub_Report.ejs", { faculty });
//     });
// });

app.get("/Student_Info", checkAuthenticatedStudent, (req, res) => {
  Student.findOne({ _id: req.user }).then((student) => {
    res.render("Student_Info.ejs", { student });
  });
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/Faculty_Signup", (req, res) => {
  res.render("Faculty_Signup");
});

app.get("/Student_Login", checkNotAuthenticatedStudent, function (req, res) {
  res.render("Student_Home_Login.ejs");
});

app.get("/", function (req, res) {
  res.render("Main_Lander.ejs");
});

app.get("/Admin_Broadcasts", function (req, res) {
  Broadcast.find({}).then((broadcast) => {
    res.render("Admin_Broadcasts.ejs", { broadcast });
  });
});

app.get("/Student_BroadCasts", checkAuthenticatedStudent, function (req, res) {
  Broadcast.find({}).then((broadcast) => {
    res.render("Student_Broadcasts.ejs", { broadcast });
  });
});

app.get("/Faculty_Broadcasts", checkAuthenticatedFaculty, function (req, res) {
  Broadcast.find({}).then((broadcast) => {
    res.render("Faculty_Broadcasts.ejs", { broadcast });
  });
});

app.get("/Admin_Student_Info", function (req, res) {
  console.log("hello");
  // res.render("Admin_Student_Info.ejs");
  Student.find({}).then((student) => {
    res.render("Admin_Student_Info.ejs", { student });
  });
});

app.get("/Admin_Faculty_Info", function (req, res) {
  console.log("hello");
  // res.render("Admin_Student_Info.ejs");
  Faculty.find({}).then((faculty) => {
    res.render("Admin_Faculty_Info.ejs", { faculty });
  });
});

app.get("/Admin_Feedback", function (req, res) {
  StudentSub.find({})
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      Courses.find({}).then((Courses) => {
        res.render("Admin_Feedback.ejs", { StuSub, Courses });
      });
    });
});

app.get("/Admin_Feedback_Details", function (req, res) {
  res.render("Admin_Feedback_Details.ejs");
});

app.get("/Admin_Feedback_Details", function (req, res) {
  console.log(req.body.Subject);
  StudentSub.find({})
    .populate("course_Name")
    .exec()
    .then(() => {
      StudentSub.find({ "course_Name.name": req.body.Subject })
        .populate("course_Name")
        .exec()
        .then((StuSub) => {
          res.render("Admin_Feedback_Details.ejs", { StuSub });
        });
    });
});

app.post("/signup", function (req, res) {
  res.render("login.ejs");
});

app.post(
  "/Faculty_Login",
  passportFaculty.authenticate("faculty", {
    successRedirect: "/Faculty_Home",
    failureRedirect: "/Faculty_Login",
    failureFlash: true,
  })
);

app.post(
  "/Student_Home",
  passportStudent.authenticate("student", {
    successRedirect: "/Student_Home",
    failureRedirect: "/Student_Home_Login",
    failureFlash: true,
  })
);

app.post("/Student_Home_Login", (req, res) => {
  function generateP() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  Student.findOne({ email: req.body.email })
    .then((student) => {
      if (student) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Student.findOneAndUpdate(
            { email: student.email },
            { password: hashedPassword, date_Of_Birth: req.body.DOB }
          ).then((x) => {
            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "kushshah358@gmail.com",
                pass: process.env.PASSWORD,
              },
            });

            var mailOptions = {
              from: "202001104@daiict.ac.in",
              to: req.body.email,
              subject: "Academic Affairs System",
              text: `Your account has been created! Your password is ${randomPass}`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } // else {
              //   console.log(req.user + "\n" + req.body.email);
              //   console.log("Email sent: " + info.response);
              // }
            });

            res.redirect("/Student_Login");
          });
        });
      } else {
        res.send(
          '<script>alert("No such email registered!"); window.location="/Student_Login";</script>'
        );
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        return res.render("login", { errors });
      } else {
        console.log("Error:", err);
        res.redirect("/Student_Home_Login");
      }
    });
});

app.post("/Faculty_Signup", (req, res) => {
  function generateP() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  Faculty.findOne({ email: req.body.email })
    .then((faculty) => {
      if (faculty) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Faculty.findOneAndUpdate(
            { email: faculty.email },
            { password: hashedPassword }
          ).then((x) => {
            console.log(x);
            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "kushshah358@gmail.com",
                pass: process.env.PASSWORD,
              },
            });

            var mailOptions = {
              from: "202001104@daiict.ac.in",
              to: req.body.email,
              subject: "Academic Affairs System",
              text: `Your account has been created! Your password is ${randomPass}`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log(req.user + "\n" + req.body.email);
                console.log("Email sent: " + info.response);
              }
            });

            res.redirect("/Faculty_Login");
          });
        });
      } else {
        res.send(
          '<script>alert("No such email registered!"); window.location="/Faculty_Login";</script>'
        );
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/", function (req, res) {
  const student1 = new Student({
    name: req.body.name,
    email: req.body.email,
    DOB: req.body.dob,
  });

  student1.save();
  // console.log(student1.DOB);
  //   console.log(student1);

  Student.findOne({
    name: student1.name,
    EmailID: student1.EmailID,
  })
    .then((studentfound) => {
      console.log(studentfound);
      if (studentfound) {
        res.redirect("/login");
      } else res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/Admin_Login", function (req, res) {
  if (
    req.body.username === process.env.Admin_name &&
    req.body.password === process.env.Admin_pswd
  ) {
    console.log(process.env.Admin_pswd);
    res.redirect("/Admin_Home");
  } else {
    console.log(process.env.Admin_pswd);
    res.redirect("/Admin_Login");
  }
});

app.post("/Student_Info", function (req, res) {
  const randomPass = req.body.password;
  bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
    Student.findOneAndUpdate(
      { _id: req.user },
      { password: hashedPassword }
    ).then((x) => {
      // else {
      //   console.log(req.user + "\n" + req.body.email);
      //   console.log("Email sent: " + info.response);

      res.redirect("/Student_Login");
      // }
    });
  });
});

app.post("/Faculty_Info", function (req, res) {
  const randomPass = req.body.password;
  bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
    Faculty.findOneAndUpdate(
      { _id: req.user },
      { password: hashedPassword }
    ).then((x) => {
      // else {
      //   console.log(req.user + "\n" + req.body.email);
      //   console.log("Email sent: " + info.response);

      res.redirect("/Faculty_Login");
      // }
    });
  });
});

app.post("/Forgot_Pswd", function (req, res) {
  function generateP() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  Student.findOne({ email: req.body.email })
    .then((student) => {
      if (student) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Student.findOneAndUpdate(
            { email: student.email },
            { password: hashedPassword },
            { new: true }
          ).then((x) => {
            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "kushshah358@gmail.com",
                pass: process.env.PASSWORD,
              },
            });

            var mailOptions = {
              from: "kushshah358@gmail.com",
              to: req.body.email,
              subject: "Academic Affairs System",
              text: `Your account has been created! Your password is ${randomPass}`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } // else {
              //   console.log(req.user + "\n" + req.body.email);
              //   console.log("Email sent: " + info.response);
              // }
            });

            res.redirect("/Student_Login");
          });
        });
      } else {
        res.send(
          '<script>alert("No such email registered!"); window.location="/Student_Login";</script>'
        );
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/Faculty_Forgot_Pswd", function (req, res) {
  function generateP() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 10; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  Faculty.findOne({ email: req.body.email })
    .then((faculty) => {
      if (faculty) {
        const randomPass = generateP();
        bcrypt.hash(randomPass, saltRounds).then((hashedPassword) => {
          Faculty.findOneAndUpdate(
            { email: faculty.email },
            { password: hashedPassword },
            { new: true }
          ).then((x) => {
            var transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "kushshah358@gmail.com",
                pass: process.env.PASSWORD,
              },
            });

            var mailOptions = {
              from: "kushshah358@gmail.com",
              to: req.body.email,
              subject: "Academic Affairs System",
              text: `Your account has been created! Your password is ${randomPass}`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } // else {
              //   console.log(req.user + "\n" + req.body.email);
              //   console.log("Email sent: " + info.response);
              // }
            });

            res.redirect("/Faculty_Login");
          });
        });
      } else {
        res.send(
          '<script>alert("No such email registered!"); window.location="/Faculty_Login";</script>'
        );
      }
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.post("/Admin_BroadCasts", function (req, res) {
  const broadcastnew = new Broadcast({
    broadcasts: req.body.Broadcast,
    date_Of_Broadcast: new Date(),
    time_Of_Broadcast: new Date(),
  });
  broadcastnew.save();
  res.redirect("/Admin_Broadcasts");
  // Broadcast.find({}).then((broadcast) => {
  //   res.render("Admin_BroadCasts.ejs", { broadcast });
  // });
});
// app.post(
//   "/login",
//   passportStudent.authenticate("student", {
//     successRedirect: "/StudentHome",
//     failureRedirect: "login",
//     failureFlash: true,
//   })
// );

app.post("/logoutStudent", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("hello");
    res.redirect("/");
  });
});

app.post("/logoutFaculty", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log("hello");
    res.redirect("/");
  });
});

app.post("/Faculty_Sub_Info", function (req, res) {
  FacultySub.findOne({
    fac_Name: req.user,
    course_Name: req.body.Subject,
  })
    .populate("course_Name")
    .exec()
    .then((FacSub) => {
      res.render("Faculty_Sub_Report.ejs", { FacSub });
    });
});

app.post("/Student_Sub_Info", function (req, res) {
  StudentSub.findOne({
    stu_Name: req.user,
    course_Name: req.body.Subject,
  })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      // console.log(StuSub);
      FacultySub.findOne({
        course_Name: StuSub.course_Name,
      }).then((FacSub) => {
        res.render("Student_Sub_Report.ejs", { StuSub, FacSub });
      });
    });
});

app.post("/Student_Feedback", function (req, res) {
  // StudentSub.find({
  //   stu_Name: req.user,
  // })
  //   .populate("course_Name")
  //   .exec()
  //   .then((StuSub) => {
  //     // console.log(StuSub);
  //     for (var i = 0; i < StuSub.length; i++) {
  //       if (StuSub[i].course_Name.name == req.body.Subject) {
  //         console.log("hello");
  //         StudentSub.updateOne(
  //           {
  //             stu_Name: req.user,
  //             course_Name: StuSub[i].course_Name,
  //           },
  //           { $set: { feedback: req.body.feedback } }
  //         );
  //       }
  //     }
  //     res.redirect("/Student_Home");
  //   });
  StudentSub.find({
    stu_Name: req.user,
  })
    .populate("course_Name")
    .exec()
    .then((StuSub) => {
      for (var i = 0; i < StuSub.length; i++) {
        if (StuSub[i].course_Name.name == req.body.Subject) {
          StuSub[i].feedback = req.body.feedback;
          console.log("yooooo");
          StuSub[i].save();
        }
      }
      res.redirect("/Student_Home");
    });
});

app.post("/Admin_Feedback", function (req, res) {
  // let response = await Courses.find({ name: req.body.name });
  // console.log(response);

  Courses.findOne({ _id: req.body.Subject }).then((course) => {
    StudentSub.find({ course_Name: course })
      .populate("course_Name")
      .exec()
      .then((StuSub) => {
        console.log(StuSub);
        res.render("Admin_Feedback_Details", { StuSub, course });
      });
  });
});

function checkAuthenticatedStudent(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Student_Login");
}

function checkAuthenticatedFaculty(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Faculty_Login");
}

function checkNotAuthenticatedStudent(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/Student_Home");
  }
  next();
}
function checkNotAuthenticatedFaculty(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/Faculty_Home");
  }
  next();
}

if (!module.parent) {
  app.listen(3030, function () {
    console.log("server is active");
  });
}

module.exports = app;
