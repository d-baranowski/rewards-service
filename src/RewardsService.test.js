import RewardsService from './RewardsService';
import ELIGIBILITY_SERVICE_OUTPUT from './EligibilitySericeOutput';
import CHANNELS from './Channels';
import REWARDS from './Rewards';
import {IncorrectEligibilityServiceError} from './RewardsService.errors';

const { SPORTS, MUSIC, MOVIES } = CHANNELS;
const { KARAOKE_PRO_MICROPHONE, CHAMPIONS_LEAGUE_FINAL_TICKET, PIRATES_OF_THE_CARIBBEAN_COLLECTION } = REWARDS;

const instantiationSuccess = () => {
    const eligibilityService = {
        checkRewardsEligibilityByAccountNumber: jest.fn()
    };

    test("RewardsService is constructed", () => {
        const result = new RewardsService(eligibilityService);
        expect(result.__proto__.constructor).toBe(RewardsService)
    });
};

const instantiationFailure = () => {
    test("RewardsService construction fails", () => {
        expect(() => new RewardsService({})).toThrow(IncorrectEligibilityServiceError)
    });
};

const returnRelevantRewards = () => {
    const eligibilityService = {
        checkRewardsEligibilityByAccountNumber: jest.fn(() => ELIGIBILITY_SERVICE_OUTPUT.CUSTOMER_ELIGIBLE)
    };

    const rewardsService = new RewardsService(eligibilityService);
    const accountNumber = "SAMPLE_ACCOUNT_NUMBER";

    beforeEach(() => {
        eligibilityService.checkRewardsEligibilityByAccountNumber.mockClear()
    });

    test("RewardsService returns CHAMPIONS_LEAGUE_FINAL_TICKET", async () => {
        const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
        expect(result).toContain(CHAMPIONS_LEAGUE_FINAL_TICKET);
    });

    test("RewardsService returns KARAOKE_PRO_MICROPHONE", async () => {
        const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MUSIC]);
        expect(result).toContain(KARAOKE_PRO_MICROPHONE);
    });

    test("RewardsService returns PIRATES_OF_THE_CARIBBEAN_COLLECTION", async () => {
        const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MOVIES]);
        expect(result).toContain(PIRATES_OF_THE_CARIBBEAN_COLLECTION);
    });

    test("RewardsService doesn't return incorrect rewards", async () => {
        const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
        expect(result).not.toContain(KARAOKE_PRO_MICROPHONE);
    });

    test("RewardsService passes correct arguments to EligibilityService", async () => {
        await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
        expect(eligibilityService.checkRewardsEligibilityByAccountNumber.mock.calls.length).toBe(1);
        expect(eligibilityService.checkRewardsEligibilityByAccountNumber.mock.calls[0][0]).toBe(accountNumber);
    })
};

describe("RewardsService", () => {
    describe("Given correct EligibilityService the RewardsService gets instantiated", instantiationSuccess);
    describe("Given incorrect EligibilityService the RewardsService constructor throws an exception", instantiationFailure);
    describe("Given the EligibilityService returns CUSTOMER_ELIGIBLE then return relevant rewards", returnRelevantRewards);
});


