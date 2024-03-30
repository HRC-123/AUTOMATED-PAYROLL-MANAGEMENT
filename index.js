const connectToMongo = require("./db");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const { flash } = require("express-flash-message");
const session = require("express-session");
const mongoose = require("mongoose");
var admin;
let bcrypt = require("bcrypt");//Encryption
const saltRounds = 10
const today = new Date();
const thismonth = today.toLocaleString("default", { month: "long" });
const month = today.getMonth();
const year = today.getFullYear();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const Employee = mongoose.model("Employee");
const Leave = mongoose.model("Leave");
require("dotenv").config();
const port = process.env.PORT;

connectToMongo();
const samplesalary = [
  {
    month: "January",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "February",
    year: 2023,
    totaldays: 28,
    paidleaves: 0,
    presentdays: 28,
    salary: 0,
  },
  {
    month: "March",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "April",
    year: 2023,
    totaldays: 30,
    paidleaves: 0,
    presentdays: 30,
    salary: 0,
  },
  {
    month: "May",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "June",
    year: 2023,
    totaldays: 30,
    paidleaves: 0,
    presentdays: 30,
    salary: 0,
  },
  {
    month: "July",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "August",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "September",
    year: 2023,
    totaldays: 30,
    paidleaves: 0,
    presentdays: 30,
    salary: 0,
  },
  {
    month: "October",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
  {
    month: "November",
    year: 2023,
    totaldays: 30,
    paidleaves: 0,
    presentdays: 30,
    salary: 0,
  },
  {
    month: "December",
    year: 2023,
    totaldays: 31,
    paidleaves: 0,
    presentdays: 31,
    salary: 0,
  },
];
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/Templates"));
app.set("layout", "./Templates/main");
// app.use(express.static(__dirname + '/public'));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //1Week
    },
  })
);

app.use(flash({ sessionKeyName: "flashMessage" }));
app.get("/", (req, res) => {
  res.render("main");
});   

app.get("/register", async (req, res) => {
  const messages = await req.consumeFlash("info");
  res.render("register", { messages });
});

app.post("/register", async (req, res) => {
  const registerme = new Employee();``
  registerme.fullName = req.body.name;
  let useremail = req.body.email;
  const userform = await Employee.findOne({ email: useremail });
  if (!userform) {
    // console.log("userform " + userform);
    registerme.email = req.body.email;
    let password = req.body.password;
    
  let updatedpassword = await bcrypt.hash(req.body.password,10);
  // console.log(updatedpassword);
  // console.log("updated");
    registerme.password = updatedpassword;
    // console.log("password");
    const role = req.body.role;

    if (role == "admin" || role == "employee") {
      registerme.createdAt = Date.now();
      registerme.updatedAt = Date.now();
      registerme.role = role;
      registerme.grosssalary = samplesalary;
      // console.log("regis");
      const registered = await registerme.save();
      // console.log("tered");
    } else {
      await req.flash("info", "Wrong Role Option !! Try Again");
      console.log("Invalid Role option");
    }
  } else {
    await req.flash("info", "Email already registered ! Please Login !!");
  }
  res.redirect("/login");
  // res.render('index');
});

app.get("/login", async (req, res) => {
  const messages = await req.consumeFlash("info");
  // console.log(messages);
  res.render("register", { messages });
});

async function check(userpassword, actualpassword){
  let isEqual = await bcrypt.compare(userpassword, actualpassword);
  console.log(userpassword);
  console.log(actualpassword);
  console.log(isEqual);
  return isEqual;
}

app.post("/login", async (req, res) => {
  const useremail = req.body.email;
  const userpassword = req.body.password;
  const userform = await Employee.findOne({ email: useremail });
  let actualpassword = userform.password;
  if (!userform) {
    await req.flash("info", "Wrong Credentials! Email not found !! Try Again");
    res.redirect("/login");
    // userform.password == userpassword
  } else if(await (check(userpassword, actualpassword))) {
    if (userform.role === "admin") {
      admin = userform;
      adminid = admin._id;

      // console.log(userform);
      // console.log(admin);
      console.log("Correct_Admin");
      res.redirect(`/dashboard_admin/${userform._id}`);
    } else if (userform.role === "employee") {
      res.redirect(`dashboard_employee/${userform._id}`);
      console.log("Correct_Employee");
    }
  } else {
    await req.flash(
      "info",
      "Wrong Credentials! Password not found !! Try Again"
    );
    // console.log(messages);
    console.log("Wrong");
    res.redirect("/login");
  }

  // const registered = await registerme.save();
  // res.render('index');
});

app.get("/dashboard_admin/:id", async (req, res) => {
  const locals = {
    title: "Dashboard Admin",
    description: "",
  };
  const emp = await Employee.findOne({ _id: req.params.id });
  const employees = await Employee.find();
  const count = await Employee.countDocuments();

  let avgleaves = 0;
  let salary = 0;


  // const getDetails = employees.map((e)=>e.grosssalary['March']);
  // console.log(getDetails);

  const fetching = await Employee.find(
    { "grosssalary.month": thismonth },
    "grosssalary.$"
  )
    .then((employees) => {
      employees.forEach((employee) => {
        // console.log(`Employee ID: ${employee._id}, Gross Salary: ${employee.grosssalary[0].salary}`);
        let paidLeaves = employee.grosssalary[0].paidleaves;
        let presentDays = employee.grosssalary[0].presentdays;
        let grossSalary = employee.grosssalary[0].salary;
        //  console.log(paidLeaves);
        //      console.log(presentDays);
        //      console.log(grossSalary);
        avgleaves += daysInMonth - (paidLeaves + presentDays);
        salary += grossSalary;

        // console.log("avg leaves " + avgleaves);
        // console.log(" salary " + salary);
      });
    })
    .catch((err) => {
      console.error(err);
    });

  // const empo = await getDetails.findOne({"grosssalary.month": thismonth });
  // if (empo) {
  //     let totalDays = daysInMonth;
  //     let paidLeaves =  (empo);
  //     let presentDays = Number(empo.grosssalary.presentdays);
  //     let grossSalary = Number(empo.grosssalary.salary);

  //     console.log(`Paid Leaves for ${e.fullName}: ${paidLeaves}`);
  //     console.log(`Present Days for ${e.fullName}: ${presentDays}`);
  //     console.log(`Gross Salary for ${e.fullName}: ${grossSalary}`);

  //     if (isNaN(paidLeaves) || isNaN(presentDays) || isNaN(grossSalary)) {
  //         console.log('Error: One of the values is not a number.');
  //     } else {
  //         avgleaves = avgleaves + (totalDays - (paidLeaves + presentDays));
  //         salary = salary + grossSalary;
  //     }
  // } else {
  //     console.log(`No gross salary data found for ${e.fullName} for the current month.`);
  // }

  avgleaves = avgleaves / count;
  avgleaves = Math.trunc(avgleaves);

  console.log("avg leaves" + avgleaves);
  // const employees = await Employee.findOne({_id: '65477c1b73e24817082ec614'})

  //! Prepare data for charting
  const employeeNames = employees.map((employee) => employee.fullName);
  const employeeSalaries = employees.map((employee) => {
    const salaryForMonth = employee.grosssalary.find(
      (salary) => salary.month === thismonth
    );
    return salaryForMonth ? salaryForMonth.salary : null;
  });
  const employeeLeaves = employees.map((employee) => {
    const salaryForMonth = employee.grosssalary.find(
      (salary) => salary.month === thismonth
    );
    return salaryForMonth
      ? salaryForMonth.totaldays -
          (salaryForMonth.paidleaves + salaryForMonth.presentdays)
      : null;
  });

  // filter out employees for whom salary or leaves are null
  const validIndices = employeeSalaries.reduce((indices, salary, index) => {
    if (salary !== null && employeeLeaves[index] !== null) {
      indices.push(index);
    }
    return indices;
  }, []);

  const validEmployeeNames = validIndices.map((index) => employeeNames[index]);
  const validEmployeeSalaries = validIndices.map(
    (index) => employeeSalaries[index]
  );
  const validEmployeeLeaves = validIndices.map(
    (index) => employeeLeaves[index]
  );

  res.render("dashboard_admin", {
    emp,
    avgleaves,
    count,
    salary,
    locals,
    employees: employees,
    employeeNames: JSON.stringify(validEmployeeNames),
    employeeSalaries: JSON.stringify(validEmployeeSalaries),
    employeeLeaves: JSON.stringify(validEmployeeLeaves),
  });
});

app.get("/editpage/:id", async (req, res) => {
  const emp = await Employee.findOne({ _id: req.params.id });
  const messages = await req.consumeFlash("info");
  const locals = {
    title: "List of Employees",
    description: "",
  };

  try {
    const employees = await Employee.find();
    const count = await Employee.countDocuments();
    // const month = employees.grosssalary.find(salary => salary.month == 'January');

    res.render("editPage", {
      employees,
      emp,
      // month,
      locals,
      messages,
      admin,
      thismonth,
    });
  } catch (error) {
    console.log("error in homepage" + error);
  }
});

app.get("/add/:id", async (req, res) => {
  const locals = {
    title: "Add New Employee",
    description: "",
  };
  res.render("employee/add", { locals, admin });
});

app.post("/add", async (req, res) => {
  // console.log(req.body);
  const newEmployee = new Employee({
    fullName: req.body.fullName,
    phonenumber: req.body.phonenumber,
    email: req.body.email,
    address: req.body.address,
    role: req.body.role,
    netsalary: req.body.netsalary,
    grosssalary: samplesalary,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const emp = await Employee.findOne({ email: req.params.email });
  try {
    await Employee.create(newEmployee);
    await req.flash("info", "New Employee has been added");
    res.redirect(`/editpage/${adminid}`);
  } catch (error) {
    console.log(error);
  }
});

app.get("/view/:id", async (req, res) => {
  try {
    const employees = await Employee.findOne({ _id: req.params.id });
    let monthDetails;
    const fetching = await Employee.findOne({ _id: req.params.id })
      .then((employee) => {
        monthDetails = employee.grosssalary.find(
          (salary) => salary.month === thismonth
        );
        // console.log(monthDetails);
      })
      .catch((err) => {
        console.error(err);
      });

    const locals = {
      title: "View Employee Data",
      description: "",
    };

    res.render("employee/view", {
      locals,
      employees,
      admin,
      monthDetails,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    // const employees = await Employee.findOne({ _id: req.params.id });
    // const monthDetails = employees.find({"grosssalary.month": thismonth});
    let monthDetails;
    const employees = await Employee.findOne({ _id: req.params.id });
    const employee = await Employee.findOne({ _id: req.params.id })
      .then((employee) => {
        monthDetails = employee.grosssalary.find(
          (salary) => salary.month === thismonth
        );
        // console.log(monthDetails);
      })
      .catch((err) => {
        console.error(err);
      });

    // const monthDetails = month ? month : employees;
    // console.log(monthDetails);
    // const thismonth = JSON.stringify(month);
    const locals = {
      title: "Edit Customer Data",
      description: "",
    };

    res.render("employee/edit", {
      locals,
      employees,
      admin,
      monthDetails,
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/edit/:id", async (req, res) => {
  try {
    const employees = await Employee.findByIdAndUpdate(req.params.id);

    employees.fullName = req.body.fullName;
    employees.phonenumber = req.body.phonenumber;
    let password = req.body.password;
    let updatedpassword = await bcrypt.hash(req.body.password,10);
    employees.password = updatedpassword;
    employees.email = req.body.email;
    employees.netsalary = Number(req.body.netsalary);
    employees.role = req.body.role;
    employees.address = req.body.address;
    employees.updatedAt = Date.now();
    var salary;
    //  = (employees.grosssalary.presentdays + employees.grosssalary.paidleaves);
    let netsalary = employees.netsalary;
    let presentDays = Number(req.body.presentdays);
    let paidLeaves = Number(req.body.paidleaves);

    if (isNaN(presentDays) || isNaN(paidLeaves)) {
      console.log("Error: One of the values is not a number.");
    } else {
      salary = Math.trunc(
        (netsalary * (presentDays + paidLeaves)) / daysInMonth
      );
    }

    // employees.grosssalary.salary = Math.trunc((req.body.netsalary * (req.body.presentdays + req.body.paidleaves)) /employees.grosssalary.totaldays);
    // const t = await employees.grosssalary.save();

    console.log("Month : " + daysInMonth);
    console.log(salary);
    const salaryUpdate = await Employee.findOneAndUpdate(
      { _id: req.params.id, "grosssalary.month": thismonth },
      {
        $set: {
          "grosssalary.$.paidleaves": paidLeaves,
          "grosssalary.$.presentdays": presentDays,
          "grosssalary.$.salary": salary,
        },
      },
      { new: true }
    );

    // console.log(salaryUpdate);

    //   month: 'January',
    //   year: 2023,
    //   totaldays: 31,
    //   paidleaves: req.body.paidleaves,
    //   presentdays:req.body.presentdays,
    // };

    const registered = await employees.save();
    // console.log(employees.grosssalary);
    // console.log(registered);
    res.redirect(`/edit/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/edit/:id", async (req, res) => {
  try {
    if (req.params.id == admin._id) {
      await req.flash("info", "This operation cannot be performed!!");
    } else {
      const emp = await Employee.findOne({ _id: req.params.id });
      await req.flash("info", `Employee named ${emp.fullName} is deleted!!`);
      await Employee.deleteOne({ _id: req.params.id });
    }

    let adminid = admin._id;
    res.redirect(`/editpage/${adminid}`);
  } catch (err) {
    console.log(err);
  }
});

app.get("/dashboard_employee/:id", async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id });
  const emp = employee.grosssalary;

  const monthNames = emp.map((employee) => employee.month);
  const employeeSalaries = emp.map((employee) => employee.salary);
  const employeeLeaves = emp.map(
    (employee) =>
      employee.totaldays - (employee.presentdays + employee.paidleaves)
  );

  // filter out employees for whom salary or leaves are null
  const validIndices = employeeSalaries.reduce((indices, salary, index) => {
    if (salary !== null && employeeLeaves[index] !== null) {
      indices.push(index);
    }
    return indices;
  }, []);

  const validMonthNames = validIndices.map((index) => monthNames[index]);
  const validEmployeeSalaries = validIndices.map(
    (index) => employeeSalaries[index]
  );
  const validEmployeeLeaves = validIndices.map(
    (index) => employeeLeaves[index]
  );

  res.render("dashboard_employee", {
    employee,
    monthNames: JSON.stringify(validMonthNames),
    employeeSalaries: JSON.stringify(validEmployeeSalaries),
    employeeLeaves: JSON.stringify(validEmployeeLeaves),
  });
});

app.get("/leaveform/:id", async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id });
  res.render("employee/leaveform", { employee });
});

app.post("/leaveform/:id", async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id });
  let monthDetails;
  const fetching = await Employee.findOne({ _id: req.params.id })
    .then((employee) => {
      monthDetails = employee.grosssalary.find(
        (salary) => salary.month === thismonth
      );
      console.log(monthDetails);
    })
    .catch((err) => {
      console.error(err);
    });

  let presentDays = monthDetails.presentdays;
  presentDays -= req.body.days;

  const salaryUpdate = await Employee.findOneAndUpdate(
    { _id: req.params.id, "grosssalary.month": thismonth },
    {
      $set: {
        "grosssalary.$.presentdays": presentDays,
      },
    },
    { new: true }
  );

  console.log("We are back Online Sir!!");

  const newLeave = new Leave({
    fullName: req.body.fullName,
    email: req.body.email,
    purpose: req.body.purpose,
    days: req.body.days,
  });

  try {
    await Leave.create(newLeave);
    const registered = await employee.save();
    // const registered = await employee.save();
    // console.log(monthDetails);
    // console.log(registered);
    res.redirect(`/dashboard_employee/${req.params.id}`);
  } catch (err) {
    console.log("Error in new Leave" + err);
  }
});

app.get("/viewemployee/:id", async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id });
  let monthDetails;
  const fetching = await Employee.findOne({ _id: req.params.id })
    .then((employee) => {
      monthDetails = employee.grosssalary.find(
        (salary) => salary.month === thismonth
      );
      // console.log(monthDetails);
    })
    .catch((err) => {
      console.error(err);
    });
  res.render("employee/viewemployee", { employee, monthDetails });
});

app.get("*", (req, res) => {
  res.render("404");
});

// app.engine(
//   "ejs",
//   exphbs.engine({
//     handlebars: allowInsecurePrototypeAccess(handlebars),
//     extname: "hbs",
//     defaultLayout: "",]
//     layoutsDir: __dirname + "/Templates",
//   })
// );

app.listen(port, () => {
  console.log(`Server startedon on port : ${port}`);
});

//TODO:Dashboard of admin
