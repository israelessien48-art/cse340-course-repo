import {
  getAllCategories,
  getCategoryDetails,
  getProjectsByCategoryId
} from "../models/categories.js";

export async function showCategoriesPage(req, res, next) {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Categories",
      categories
    });
  } catch (error) {
    next(error);
  }
}

export async function showCategoryDetailsPage(req, res, next) {
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
}