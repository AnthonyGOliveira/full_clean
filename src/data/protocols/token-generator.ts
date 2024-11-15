import { AccountTokenModel } from "../models/account-token-model";
export interface TokenResponse {
    token: string
    expiresIn
}

export interface TokenGenerator {
    generate(account: AccountTokenModel): TokenResponse
}