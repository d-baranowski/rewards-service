export default class RewardsService {
    constructor(eligibilityService) {
        if (!eligibilityService || !eligibilityService.checkRewardsEligibilityByAccountNumber) {
            throw "Incorrect EligibilityService provided";
        }

        this.eligibilityService = eligibilityService;
    }
}