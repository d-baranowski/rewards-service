import REWARDS from './Rewards'
import ELIGIBILITY_SERVICE_OUTPUT from './EligibilitySericeOutput'
import {
    IncorrectEligibilityServiceError,
    EligibilityServiceTechnicalFailureError
} from './Errors'
import {CHANNELS} from '../Business'
import {ArgumentInvalidError} from '../Errors'

class RewardsService {
    constructor (eligibilityService) {
        if (!eligibilityService || !eligibilityService.checkRewardsEligibilityByAccountNumber) {
            throw new IncorrectEligibilityServiceError()
        }

        this.eligibilityService = eligibilityService
    }

  getRewardsByAccountNumberAndSubscriptions = async (accountNumber, channelSubscriptions) => {
      this.validateArguments(accountNumber, channelSubscriptions)
      let customerEligibility = null
      let rewards = []

      try {
          customerEligibility = await this.eligibilityService.checkRewardsEligibilityByAccountNumber(accountNumber)
      } catch (err) {
          if (err instanceof EligibilityServiceTechnicalFailureError) {
              return rewards
          }

          throw err
      }

      const { CUSTOMER_ELIGIBLE } = ELIGIBILITY_SERVICE_OUTPUT

      if (customerEligibility === CUSTOMER_ELIGIBLE) {
          for (const subscription of channelSubscriptions) {
              const reward = this.getRewardByChannel(subscription)
              if (reward) {
                  rewards = [...rewards, reward]
              }
          }
      }

      return rewards
  };

  validateArguments = (accountNumber, channelSubscriptions) => {
      if (!accountNumber) {
          throw new ArgumentInvalidError('No accountNumber provided')
      }
      if (!Array.isArray(channelSubscriptions)) {
          throw new ArgumentInvalidError('channelSubscriptions need to be an array')
      }
  };

  getRewardByChannel = (channelSubscription) => {
      const {SPORTS, MUSIC, MOVIES} = CHANNELS
      const {CHAMPIONS_LEAGUE_FINAL_TICKET, KARAOKE_PRO_MICROPHONE, PIRATES_OF_THE_CARIBBEAN_COLLECTION} = REWARDS

      switch (channelSubscription) {
      case SPORTS:
          return CHAMPIONS_LEAGUE_FINAL_TICKET
      case MUSIC:
          return KARAOKE_PRO_MICROPHONE
      case MOVIES:
          return PIRATES_OF_THE_CARIBBEAN_COLLECTION
      default:
          return null
      }
  }
}

export default RewardsService
