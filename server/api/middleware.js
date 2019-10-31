module.exports.isLoggedIn = (req, res, next) => {
  if (req.user.id) {
    next();
  } else {
    const error = new Error();
    error.message = "Denied: Must be logged in";
    error.status = 201;
    next(error);
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.label === "admin") {
    next();
  } else {
    const error = new Error();
    error.message = "Denied: Administrator access only";
    error.status = 201;
    next(error);
  }
};

module.exports.isProvider = (req, res, next) => {
  if (req.user.label === "provider") {
    next();
  } else {
    const error = new Error();
    error.message = "Denied: Provider access only";
    error.status = 201;
    next(error);
  }
};

module.exports.isPatientOrProvider = (req, res, next) => {
  if (
    (req.user.label === "patient" && req.user.id === Number(req.params.id)) ||
    req.user.label === "provider"
  ) {
    next();
  } else {
    const error = new Error();
    error.message = "Denied: Provider access only";
    error.status = 201;
    next(error);
  }
};

module.exports.isUser = (req, res, next) => {
  if (req.user.id === Number(req.params.id)) {
    next();
  } else {
    const error = new Error();
    error.message = "Denied";
    error.status = 201;
    next(error);
  }
};

module.exports.isProviderOrAdmin = (req, res, next) => {
  if (
    (req.user.label === "provider" && req.user.id === Number(req.params.id)) ||
    req.user.label === "admin"
  ) {
    next();
  } else {
    const error = new Error();
    error.message = "Denied";
    error.status = 201;
    next(error);
  }
};
