import {ApplicationError} from '../../Errors'

class EligibilityServiceTechnicalFailureError extends ApplicationError {
  constructor () {
    super('EligibilityService technical failure')
  }
}

export default EligibilityServiceTechnicalFailureError
