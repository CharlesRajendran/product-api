/* eslint-disable jest/no-try-expect */
/* eslint-disable jest/no-conditional-expect */
const ErrorHelper = require('../../../dist/src/utilities/errorHelper');

describe('#ErrorUtility', () => {
  describe('##ErrorHelper', () => {
    it('should return boom error object for handled errors when passing error message and status code', async () => {
      const actual400 = ErrorHelper({
        message: '400 Error',
        statusCode: 400,
      });

      const actual409 = ErrorHelper({
        message: '409 Error',
        statusCode: 409,
      });

      expect(actual400.payload.error).toBe('Bad Request');
      expect(actual409.payload.error).toBe('Conflict');
    });

    it('should return 500 server boom error object for un handled/ un known errors', async () => {
      const actualUnknowError = ErrorHelper({
        message: 'Wrong Error',
        statusCode: 487,
      });

      expect(actualUnknowError.payload.error).toBe('Internal Server Error');
      expect(actualUnknowError.payload.statusCode).toBe(500);
    });
  });
});
