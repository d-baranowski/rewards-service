import {ApplicationError} from './ApplicationError';

export class IncorrectEligibilityServiceError extends ApplicationError {
    constructor() {
        super("Incorrect EligibilityService provided");
    }
}