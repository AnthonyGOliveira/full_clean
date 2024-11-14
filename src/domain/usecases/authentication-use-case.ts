export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthenticationUseCase {
  execute(addAcount: LoginModel): Promise<AuthResponse | null>;
}
