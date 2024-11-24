export interface TokenVerifierResponse {
  id: string;
  email: string;
  role: string;
}

export interface TokenVerifier {
  verify(token: string): TokenVerifierResponse;
}
