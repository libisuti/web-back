const router = require("express").Router();
const Employee = require("../models/employee");
const uploadFile = require("../middleware/upload");
router.post("/", async (req, res, next) => {
  let employee = new Employee();
  await uploadFile(req, res);
  employee.name = req.body.name;
  employee.producttype = req.body.producttype;
  employee.price = req.body.price;
  employee.image = req.file.originalname;
  employee.enrollDate = req.body.enrollDate;

  try {
    employee = await employee.save();

    if (!employee) {
      return res.status(500).json({
        success: false,
        message: "the employee cannot be created",
      });
    }

    res.json({
      success: true,
      employee: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "the employee cannot be created",
      error: error,
    });
  }
});

module.exports = router;
