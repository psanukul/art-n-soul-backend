export const asyncHandler = (fn) => {
  // yoh bhai isliye return hai taki khud express load hote time isko chlawe na by default
    return (req, res, next) => {
      fn(req, res, next).catch((err) => next(err));
    };
  };