export const buildHome = (req, res) => {
  res.render("home", {
    title: "Home"
  });
};