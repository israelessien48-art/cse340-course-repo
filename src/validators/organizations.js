import { body } from "express-validator";

export const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required."),

  body("contact_email")
    .trim()
    .notEmpty()
    .withMessage("Contact email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .isLength({ max: 255 })
    .withMessage("Contact email must not exceed 255 characters."),

  body("logo_filename")
    .trim()
    .notEmpty()
    .withMessage("Logo filename is required.")
    .isLength({ max: 255 })
    .withMessage("Logo filename must not exceed 255 characters.")
];