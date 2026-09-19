export const show404 = (req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
};

export const show500 = (err, req, res, next) => {
  console.error("Error occurred:", err.message);
  console.error("Stack trace:", err.stack);

  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  res.status(status).render(`errors/${template}`, {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: err.message,
    stack: err.stack
  });
};