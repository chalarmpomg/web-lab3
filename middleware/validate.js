function validate(schema, options = {}) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);

      if (options.view) {
        return res.status(400).render(options.view, {
          title: options.title,
          error: errors.join(', '),
          form: req.body,
        });
      }

      return res.status(400).render('pages/error', {
        title: 'ข้อมูลไม่ถูกต้อง',
        message: errors.join(', '),
        statusCode: 400,
      });
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
