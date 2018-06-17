import {IncorrectEligibilityServiceError} from './RewardsService.errors';
import CHANNELS from './Channels';
import REWARDS from './Rewards';
import ELIGIBILITY_SERVICE_OUTPUT from './EligibilitySericeOutput';

export default class RewardsService {
    constructor(eligibilityService) {
        if (!eligibilityService || !eligibilityService.checkRewardsEligibilityByAccountNumber) {
            throw IncorrectEligibilityServiceError;
        }

        this.eligibilityService = eligibilityService;
    }

    getRewardsByAccountNumberAndSubscriptions = async (accountNumber, channelSubscriptions) => {
        const customerEligibility = await this.eligibilityService.checkRewardsEligibilityByAccountNumber(accountNumber);
        const { CUSTOMER_ELIGIBLE } = ELIGIBILITY_SERVICE_OUTPUT;
        let rewards = [];

        if (customerEligibility === CUSTOMER_ELIGIBLE) {
            for (const subscription of channelSubscriptions) {
                rewards = [...rewards, this.getRewardByChannel(subscription)]
            }
        }

        return rewards;
    };

    getRewardByChannel = (channelSubscription) => {
        const {SPORTS, MUSIC, MOVIES} = CHANNELS;
        const {CHAMPIONS_LEAGUE_FINAL_TICKET, KARAOKE_PRO_MICROPHONE, PIRATES_OF_THE_CARIBBEAN_COLLECTION} = REWARDS;

        switch (channelSubscription) {
            case SPORTS:
                return CHAMPIONS_LEAGUE_FINAL_TICKET;
            case MUSIC:
                return KARAOKE_PRO_MICROPHONE;
            case MOVIES:
                return PIRATES_OF_THE_CARIBBEAN_COLLECTION;
            default:
                return null;
        }
    }
}