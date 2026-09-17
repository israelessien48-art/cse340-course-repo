import { getAllUsers } from "../models/users.js";

export async function showUsersPage(req, res) {
  try {
    const users = await getAllUsers();

    res.render("users", {
      title: "Users",
      users
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).render("errors/500", {
      title: "Server Error"
    });
  }
}