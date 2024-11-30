export interface UpdateAccount {
  role: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
  confirmationPassword?: string;
}

export interface UpdateAccountResponse {
  message: string;
}

export interface UpdateAccountUseCase {
  execute(
    updateAccount: UpdateAccount
  ): Promise<UpdateAccountResponse | null>;
}
