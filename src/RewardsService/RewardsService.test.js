import RewardsService from './RewardsService'
import ELIGIBILITY_SERVICE_OUTPUT from './EligibilitySericeOutput'
import CHANNELS from '../Business/Channels'
import REWARDS from './Rewards'
import {
  IncorrectEligibilityServiceError,
  InvalidAccountNumberError,
  EligibilityServiceTechnicalFailureError
} from './Errors'
import {ArgumentInvalidError} from '../Errors'

const { SPORTS, MUSIC, MOVIES } = CHANNELS;
const { KARAOKE_PRO_MICROPHONE, CHAMPIONS_LEAGUE_FINAL_TICKET, PIRATES_OF_THE_CARIBBEAN_COLLECTION } = REWARDS;
const { CUSTOMER_ELIGIBLE, CUSTOMER_INELIGIBLE } = ELIGIBILITY_SERVICE_OUTPUT;

const instantiationSuccess = () => {
  const eligibilityService = {
    checkRewardsEligibilityByAccountNumber: jest.fn()
  };

  test('RewardsService is constructed', () => {
    const result = new RewardsService(eligibilityService);
    expect(result).toBeInstanceOf(RewardsService)
  })
};

const instantiationFailure = () => {
  test('RewardsService construction fails', () => {
    expect(() => new RewardsService({})).toThrow(new IncorrectEligibilityServiceError())
  })
};

const argumentPassingTest = (rewardsService, accountNumber, eligibilityService) => {
  test('RewardsService passes correct arguments to EligibilityService', async () => {
    await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
    expect(eligibilityService.checkRewardsEligibilityByAccountNumber.mock.calls.length).toBe(1);
    expect(eligibilityService.checkRewardsEligibilityByAccountNumber.mock.calls[0][0]).toBe(accountNumber)
  })
};

const returnRelevantRewards = () => {
  const eligibilityService = {
    checkRewardsEligibilityByAccountNumber:
            jest.fn().mockResolvedValue(CUSTOMER_ELIGIBLE)
  };

  const rewardsService = new RewardsService(eligibilityService);
  const accountNumber = 123456;

  beforeEach(() => {
    eligibilityService.checkRewardsEligibilityByAccountNumber.mockClear()
  });

  test('RewardsService returns CHAMPIONS_LEAGUE_FINAL_TICKET', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
    expect(result).toContain(CHAMPIONS_LEAGUE_FINAL_TICKET)
  });

  test('RewardsService returns KARAOKE_PRO_MICROPHONE', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MUSIC]);
    expect(result).toContain(KARAOKE_PRO_MICROPHONE)
  });

  test('RewardsService returns PIRATES_OF_THE_CARIBBEAN_COLLECTION', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MOVIES]);
    expect(result).toContain(PIRATES_OF_THE_CARIBBEAN_COLLECTION)
  });

  test("RewardsService doesn't return incorrect rewards", async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
    expect(result).not.toContain(KARAOKE_PRO_MICROPHONE)
  });

  argumentPassingTest(rewardsService, accountNumber, eligibilityService)
};

const returnNoRewardsWith = (eligibilityService) => () => {
  const rewardsService = new RewardsService(eligibilityService);
  const accountNumber = 654321;

  beforeEach(() => {
    eligibilityService.checkRewardsEligibilityByAccountNumber.mockClear()
  });

  test('RewardsService returns no rewards for SPORTS', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [SPORTS]);
    expect(result.length).toBe(0)
  });

  test('RewardsService returns no rewards for MUSIC', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MUSIC]);
    expect(result.length).toBe(0)
  });

  test('RewardsService returns no rewards for MOVIES', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MOVIES]);
    expect(result.length).toBe(0)
  });

  test('RewardsService returns no rewards for multiple channels', async () => {
    const result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, [MOVIES, MUSIC]);
    expect(result.length).toBe(0)
  })
};

const exceptionalBehaviour = async () => {
  const eligibilityService = {
    checkRewardsEligibilityByAccountNumber:
            jest.fn().mockResolvedValue(CUSTOMER_ELIGIBLE)
  };

  const rewardsService = new RewardsService(eligibilityService);
  const accountNumber = 415124;

  beforeEach(() => {
    eligibilityService.checkRewardsEligibilityByAccountNumber.mockClear()
  });

  test('RewardsService throws InvalidArguments error when no parameters are provided', async () => {
    expect(rewardsService.getRewardsByAccountNumberAndSubscriptions())
      .rejects.toEqual(new ArgumentInvalidError())
  });

  test('RewardsService throws InvalidArguments error when only account number is provided', async () => {
    expect(rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber))
      .rejects.toEqual(new ArgumentInvalidError())
  });

  test('RewardsService throws InvalidArguments error when only subscriptions are provided', async () => {
    expect(rewardsService.getRewardsByAccountNumberAndSubscriptions([]))
      .rejects.toEqual(new ArgumentInvalidError())
  });

  test('RewardsService throws InvalidArguments error when arguments arrive in different order', async () => {
    expect(rewardsService.getRewardsByAccountNumberAndSubscriptions([], accountNumber))
      .rejects.toEqual(new ArgumentInvalidError())
  })
};

const handleInvalidAccountNumber = async () => {
  const accountNumber = "I'm invalid";

  const eligibilityService = {
    checkRewardsEligibilityByAccountNumber:
            jest.fn().mockImplementation(() => Promise.reject(new InvalidAccountNumberError(accountNumber)))
  };

  const rewardsService = new RewardsService(eligibilityService);

  test('RewardsService throws InvalidArguments error when only subscriptions are provided', async () => {
    expect(rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, []))
      .rejects.toEqual(new InvalidAccountNumberError())
  })
};

describe('RewardsService', () => {
  describe('Given correct EligibilityService the RewardsService gets instantiated', instantiationSuccess);
  describe('Given incorrect EligibilityService the RewardsService constructor throws an error', instantiationFailure);
  describe('Given the EligibilityService returns CUSTOMER_ELIGIBLE then return relevant rewards', returnRelevantRewards);
  describe('Given the EligibilityService throws a technical failure then return no rewards',
    returnNoRewardsWith({
      checkRewardsEligibilityByAccountNumber:
                jest.fn().mockImplementation(() => Promise.reject(new EligibilityServiceTechnicalFailureError()))
    })
  );
  describe('Given the EligibilityService returns CUSTOMER_INELIGIBLE then return no rewards',
    returnNoRewardsWith({
      checkRewardsEligibilityByAccountNumber:
                    jest.fn().mockImplementation(() => Promise.resolve(CUSTOMER_INELIGIBLE))
    })
  );
  describe('Given the EligibilityService throws InvalidAccountNumber then return no rewards and notify the client',
    handleInvalidAccountNumber);
  describe('When the RewardsService is given invalid parameters then an error is thrown', exceptionalBehaviour)
});
