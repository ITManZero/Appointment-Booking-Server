exports.validator = async (schema, data) => {
  try {
    await schema.validateAsync(data, { abortEarly: false });
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: e.details[0].message,
    };
  }
};
