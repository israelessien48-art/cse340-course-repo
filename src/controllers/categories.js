import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId,
  createCategory,
  updateCategory
} from "../models/categories.js";

import { validationResult } from "express-validator";

export const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Categories",
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render("category", {
      title: category.name,
      category: {
        ...category,
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

export const showNewCategoryForm = (req, res) => {
  res.render("new-category", {
    title: "Add Category",
    errors: [],
    data: {}
  });
};

export const processNewCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("new-category", {
      title: "Add Category",
      errors: errors.array(),
      data: req.body
    });
  }

  try {
    const { name } = req.body;

    await createCategory(name);

    req.flash("success", "Category created successfully.");

    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
};

export const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryDetails(categoryId);

    if (!category) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("edit-category", {
      title: `Edit ${category.name}`,
      errors: [],
      data: category
    });
  } catch (error) {
    next(error);
  }
};

export const processEditCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("edit-category", {
      title: "Edit Category",
      errors: errors.array(),
      data: {
        category_id: req.params.id,
        ...req.body
      }
    });
  }

  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash("success", "Category updated successfully.");

    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};