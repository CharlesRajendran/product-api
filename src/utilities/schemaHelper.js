const Joi = require('@hapi/joi');

const requireAccountId = () => Joi.object().keys({
  accountId: Joi.string().required(),
});

const requireSupplierId = () => Joi.object().keys({
  supplierId: Joi.string().required(),
});

const requireAccountAndSupplierId = () => requireAccountId().concat(requireSupplierId());

const requireAccountAndSupplierAndBankId = () => Joi.object()
  .keys({
    bankAccountId: Joi.string().required(),
  })
  .concat(requireAccountAndSupplierId());

const requireAccountAndRulesetId = () => Joi.object()
  .keys({
    rulesetId: Joi.string().required(),
  })
  .concat(requireAccountId());

const requireAccountAndSupplierAndRulesetId = () => requireAccountAndRulesetId().concat(requireSupplierId());

const requireAccountIdAndName = () => Joi.object()
  .keys({
    rulesetName: Joi.string().required(),
  })
  .concat(requireAccountId());

const requireAccountAndInvoiceId = () => Joi.object()
  .keys({
    invoiceId: Joi.number().required(),
  })
  .concat(requireAccountId());

module.exports = {
  requireAccountId,
  requireSupplierId,
  requireAccountAndSupplierId,
  requireAccountAndSupplierAndBankId,
  requireAccountAndRulesetId,
  requireAccountAndSupplierAndRulesetId,
  requireAccountIdAndName,
  requireAccountAndInvoiceId,
};
