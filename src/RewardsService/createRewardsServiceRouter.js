import {ArgumentInvalidError} from '../Errors'
import {InvalidAccountNumberError} from './Errors'

export const CHECK_CLIENT_REWARDS_PATH = '/check-client-rewards'

const createRewardsServiceRouter = (rewardsService, router) => {
    const checkClientRewards = async (request, response) => {
        const { accountNumber, channelSubscriptions } = request.body
        let result = []

        try {
            result = await rewardsService.getRewardsByAccountNumberAndSubscriptions(accountNumber, channelSubscriptions)
        } catch (err) {
            if (err instanceof ArgumentInvalidError || err instanceof InvalidAccountNumberError) {
                response.status(400)
                response.json({ msg: err.message })
                return
            }
        }

        response.json(result)
    }

    router.post(CHECK_CLIENT_REWARDS_PATH, checkClientRewards)

    return router
}

export default createRewardsServiceRouter
