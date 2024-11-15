import { AccountTokenModel } from "../models/account-token-model";
export interface TokenResponse {
    accessToken: string
    expiresIn
}

export interface TokenGenerator {
    generate(account: AccountTokenModel): TokenResponse
}