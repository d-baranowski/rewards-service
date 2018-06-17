import {ApplicationError} from './ApplicationError';

export const ELIGIBILITY_SERVICE_OUTPUT = Object.freeze({
    CUSTOMER_ELIGIBLE:   Symbol("CUSTOMER_ELIGIBLE"),
    CUSTOMER_INELIGIBLE:   Symbol("CUSTOMER_INELIGIBLE"),
});

export class EligibilityServiceTechnicalFailureError extends ApplicationError {
    constructor() {
        super("EligibilityService technical failure");
    }
}