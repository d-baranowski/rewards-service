import RewardsService from './RewardsService'

const eligibilityService = {
    checkRewardsEligibilityByAccountNumber: jest.fn()
};

const instantiationSuccess = () => {
    test("RewardsService is constructed", () => {
        const result = new RewardsService(eligibilityService);
        expect(result.__proto__.constructor).toBe(RewardsService)
    });
};

const instantiationFailure = () => {
    test("RewardsService construction fails", () => {
        expect(() => new RewardsService({})).toThrow("Incorrect EligibilityService provided")
    });
};

describe("RewardsService", () => {
    describe("Given correct EligibilityService the RewardsService gets instantiated", instantiationSuccess);
    describe("Given incorrect EligibilityService the RewardsService constructor throws an exception", instantiationFailure);
});


