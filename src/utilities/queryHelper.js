/**
 * @description Find whether record exist by attributes
 * @param {*} Model sequalize model
 * @param {*} attributes where statement
 */
const checkRecordExistByAttribute = async (Model, attributes) => {
  // check whether product with it exist
  const existingProductRecord = await Model.findOne({
    where: { ...attributes },
  });

  if (!existingProductRecord) {
    const Err = new Error('Product with the ID is not Found');
    Err.code = 404;
    throw Err;
  }

  return true;
};

module.exports = {
  checkRecordExistByAttribute,
};
