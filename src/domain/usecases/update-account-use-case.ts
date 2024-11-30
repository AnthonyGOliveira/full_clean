export interface UpdateAccount {
  role: string;
  name: string;
  email: string;
  old_password: string;
  password: string;
  confirmationPassword: string;
}

export interface UpdateAccountResponse {
  message: string;
}

export interface UpdateAccountUseCase {
  execute(
    updateAccount: Partial<UpdateAccount>
  ): Promise<UpdateAccountResponse | null>;
}
