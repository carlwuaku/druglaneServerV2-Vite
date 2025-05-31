import { ADMIN_PASSWORD_NOT_SET, APP_ACTIVATED, APP_NOT_ACTIVATED, COMPANY_NOT_SET } from '../../utils/stringKeys'

/**
 * ActivationStateType represents the possible states of application activation.
 * It is used to determine the current activation status of the application.
 */
export type ActivationStateType =
    typeof APP_NOT_ACTIVATED |
    typeof COMPANY_NOT_SET |
    typeof ADMIN_PASSWORD_NOT_SET |
    typeof APP_ACTIVATED;