export interface AuthenticateTokenResponse {
  id: string;
}

export interface AuthenticateTokenUseCase {
  execute(token: string): AuthenticateTokenResponse | null;
}
