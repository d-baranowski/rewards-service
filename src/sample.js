import express from 'express'
import bodyParser from 'body-parser'
import {createRewardsServiceRouter, RewardsService} from './RewardsService'
import ELIGIBILITY_SERVICE_OUTPUT from './RewardsService/EligibilitySericeOutput'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8080

const rewardsService = new RewardsService({checkRewardsEligibilityByAccountNumber: () => ELIGIBILITY_SERVICE_OUTPUT.CUSTOMER_ELIGIBLE})
const router = createRewardsServiceRouter(rewardsService, express.Router())

app.use('/', router)

app.listen(port)
console.log(`Listening on port ${port}`)
