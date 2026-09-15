import { body } from "express-validator";

export const projectValidation = [
  body("organization_id")
    .trim()
    .notEmpty()
    .withMessage("Organization is required.")
    .isInt()
    .withMessage("Please select a valid organization."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Project title must be between 3 and 150 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required."),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required.")
    .isLength({ max: 255 })
    .withMessage("Project location must not exceed 255 characters."),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Project date is required.")
    .isISO8601()
    .withMessage("Please enter a valid project date.")
];