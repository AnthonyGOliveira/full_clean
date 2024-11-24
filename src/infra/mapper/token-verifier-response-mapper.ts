export interface TokenVerifierResponse {
  id: string;
  email: string;
  role: string;
}

export const TokenVerifierResponseMapper = (
  payload: any
): TokenVerifierResponse => {
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
};
