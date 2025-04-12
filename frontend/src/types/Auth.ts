import {User} from './User'

export type APISignIn = {
    user: User,
    acess_token: string
}

export type APISignUp = {
    user: User,
    access_token: string
}