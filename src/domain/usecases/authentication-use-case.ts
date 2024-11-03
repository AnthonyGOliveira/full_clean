export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

export interface FindAccount {
  email: string;
  password: string;
}

export interface AuthenticationUseCase {
  execute(addAcount: FindAccount): Promise<AuthResponse | null>;
}
