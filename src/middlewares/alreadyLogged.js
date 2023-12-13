export const alreadyLogged = (req, res, next) => {
  const estado = req.session.info || false;
  if (estado.loggedIn == true) {
    res.redirect("/products");
  } else {
    next();
  }
};
