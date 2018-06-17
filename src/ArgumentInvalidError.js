import {ApplicationError} from './ApplicationError';

class ArgumentInvalidError extends ApplicationError {
    constructor(msg) {
        super(msg);
    }
}

export default ArgumentInvalidError;