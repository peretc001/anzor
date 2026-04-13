import { $amplitude } from './amplitude'

export const eventLoginClick = () => {
  $amplitude('[Header] Login Click')
}

export const eventSignIn = () => {
  $amplitude('[SignIn] Success')
}

export const eventSignUp = () => {
  $amplitude('[SignUp] Success')
}

export const eventLogout = () => {
  $amplitude('[Logout] Success')
}

export const eventApplyFilter = (group: string, params: any) => {
  $amplitude('[Catalog] Filter Apply', {
    group,
    params
  })
}
