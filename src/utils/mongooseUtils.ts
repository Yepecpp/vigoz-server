export const ToQuery = (obj) =>
  Object.keys(obj)
    .map((key) => ({
      [key]: {
        // this should be a regex that matches if the name starts or is the value of obj[key]
        $regex: new RegExp(`^${obj[key]}`, 'g'),
      },
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

