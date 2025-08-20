const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route to create a new category
router.post("/create", categoryController.createNewCategory);

// Route to get all categories
router.get("/", categoryController.getAllCategory);

module.exports = router;