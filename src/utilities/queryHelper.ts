/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ModelCtor, Model } from 'sequelize';

/**
 * @description Find whether record exist by attributes
 * @param {*} model sequalize model
 * @param {*} attributes where statement
 */
const checkRecordExistByAttribute = async (model: ModelCtor<Model>, attributes: any): Promise<boolean> => {
  // check whether product with it exist
  const existingProductRecord:any = await model.findOne({
    where: { ...attributes },
  });

  if (!existingProductRecord) {
    const Err:any = new Error('Product with the ID is not Found');
    Err.code = 404;
    throw Err;
  }

  return true;
};

export default checkRecordExistByAttribute;
