import {ApplicationError} from './ApplicationError';

class InvalidAccountNumberError extends ApplicationError {
    constructor(accountNumber) {
        super(`Account number ${accountNumber} is invalid`);
    }
}

export default InvalidAccountNumberError;