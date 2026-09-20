import { getVolunteerProjects } from "../models/volunteers.js";

export const showDashboard = async (req, res, next) => {
  try {
    const volunteerProjects = await getVolunteerProjects(
      req.session.user.user_id
    );

    res.render("dashboard", {
      title: "Dashboard",
      volunteerProjects
    });
  } catch (error) {
    next(error);
  }
};
