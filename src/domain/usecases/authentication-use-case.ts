export interface AuthResponse {
  accessToken: string;
  expiresIn: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthenticationUseCase {
  execute(loginAccount: LoginModel): Promise<AuthResponse | null>;
}
