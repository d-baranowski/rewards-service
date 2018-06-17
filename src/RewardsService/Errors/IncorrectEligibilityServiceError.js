import {ApplicationError} from '../../Errors'

class IncorrectEligibilityServiceError extends ApplicationError {
  constructor () {
    super('Incorrect EligibilityService provided')
  }
}

export default IncorrectEligibilityServiceError
