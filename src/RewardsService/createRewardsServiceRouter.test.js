import {ArgumentInvalidError} from '../Errors'
import createRewardsServiceRouter, {CHECK_CLIENT_REWARDS_PATH} from './createRewardsServiceRouter'
import {InvalidAccountNumberError} from './Errors'

class SpyRouter {
    constructor () {
        this.callbacks = {}
    }

    post = (path, callback) => {
        this.callbacks[path] = callback
    }
}

const respondWithRewards = () => {
    const spyRouter = new SpyRouter()
    const spyResponse = { json: jest.fn() }
    const mockRewardsService = {
        getRewardsByAccountNumberAndSubscriptions: jest.fn(() => sampleRewards)
    }

    const sampleAccountNumber = 12345
    const sampleRewards = ['SOME', 'EXCELLENT', 'REWARDS']
    const sampleChannels = ['SOME', 'INTERESTING', 'CHANNELS']

    beforeAll(() => {
        createRewardsServiceRouter(mockRewardsService, spyRouter)
        const underTest = spyRouter.callbacks[CHECK_CLIENT_REWARDS_PATH]
        underTest({body: {accountNumber: sampleAccountNumber, channelSubscriptions: sampleChannels}}, spyResponse)
    })

    test('RewardsService was called with correct account number and channels', () => {
        const rewardsServiceMockCalls = mockRewardsService.getRewardsByAccountNumberAndSubscriptions.mock.calls
        expect.assertions(3)
        expect(rewardsServiceMockCalls.length).toBe(1)
        expect(rewardsServiceMockCalls[0][0]).toBe(sampleAccountNumber)
        expect(rewardsServiceMockCalls[0][1]).toBe(sampleChannels)
    })

    test('SpyResponse json method was called with sampleRewards', () => {
        expect.assertions(2)
        expect(spyResponse.json.mock.calls.length).toBe(1)
        expect(spyResponse.json.mock.calls[0][0]).toBe(sampleRewards)
    })
}

const respondWith400 = () => {
    const sampleErrorMessage = 'These arguments are no good!'

    const spyRouter = new SpyRouter()
    const spyResponse = { json: jest.fn(), status: jest.fn() }
    const mockRewardsService = {
        getRewardsByAccountNumberAndSubscriptions:
            jest.fn().mockImplementation(() => Promise.reject(new ArgumentInvalidError(sampleErrorMessage)))
    }

    beforeAll(() => {
        createRewardsServiceRouter(mockRewardsService, spyRouter)
        const underTest = spyRouter.callbacks[CHECK_CLIENT_REWARDS_PATH]
        underTest({body: {accountNumber: 0, channelSubscriptions: 0}}, spyResponse)
    })

    test('SpyResponse status method was called with 400', () => {
        const spyResponseMockCalls = spyResponse.status.mock.calls
        expect.assertions(2)
        expect(spyResponseMockCalls.length).toBe(1)
        expect(spyResponseMockCalls[0][0]).toBe(400)
    })

    test('SpyResponse json method was called with error message', () => {
        const spyResponseMockCalls = spyResponse.json.mock.calls
        expect.assertions(2)
        expect(spyResponseMockCalls.length).toBe(1)
        expect(spyResponseMockCalls[0][0]).toEqual({ msg: sampleErrorMessage })
    })
}

const respondWithInvalidAccountNumber = () => {
    const sampleAccountNumber = 12345

    const spyRouter = new SpyRouter()
    const spyResponse = { json: jest.fn(), status: jest.fn() }
    const mockRewardsService = {
        getRewardsByAccountNumberAndSubscriptions:
            jest.fn().mockImplementation(() => Promise.reject(new InvalidAccountNumberError(sampleAccountNumber)))
    }

    beforeAll(() => {
        createRewardsServiceRouter(mockRewardsService, spyRouter)
        const underTest = spyRouter.callbacks[CHECK_CLIENT_REWARDS_PATH]
        underTest({body: {accountNumber: sampleAccountNumber, channelSubscriptions: 0}}, spyResponse)
    })

    test('SpyResponse status method was called with 400', () => {
        const spyResponseMockCalls = spyResponse.status.mock.calls
        expect.assertions(2)
        expect(spyResponseMockCalls.length).toBe(1)
        expect(spyResponseMockCalls[0][0]).toBe(400)
    })

    test('SpyResponse json method was called with error message', () => {
        const spyResponseMockCalls = spyResponse.json.mock.calls
        expect.assertions(2)
        expect(spyResponseMockCalls.length).toBe(1)
        expect(spyResponseMockCalls[0][0]).toEqual({ msg: `Account number ${12345} is invalid` })
    })
}

const respondWithEmptyArray = () => {
    const spyRouter = new SpyRouter()
    const spyResponse = { json: jest.fn() }
    const mockRewardsService = {
        getRewardsByAccountNumberAndSubscriptions: jest.fn().mockImplementation(() => Promise.reject(new Error()))
    }

    beforeAll(() => {
        createRewardsServiceRouter(mockRewardsService, spyRouter)
        const underTest = spyRouter.callbacks[CHECK_CLIENT_REWARDS_PATH]
        underTest({body: {accountNumber: 1234, channelSubscriptions: ['SAMPLE', 'CHANNELS']}}, spyResponse)
    })

    test('SpyResponse json method was called with empty array', () => {
        expect.assertions(2)
        expect(spyResponse.json.mock.calls.length).toBe(1)
        expect(spyResponse.json.mock.calls[0][0]).toEqual([])
    })
}

describe('createRewardsServiceRouter', () => {
    describe('Given RewardsService returns rewards respond with these rewards', respondWithRewards)
    describe('Given RewardsService throws ArgumentInvalidError return 400 with message', respondWith400)
    describe('Given RewardsService throws an unexpected exception return empty array', respondWithEmptyArray)
    describe('Given RewardsService throws an InvalidAccountNumberError then return appropriate error message',
        respondWithInvalidAccountNumber)
})
