import { Mapper } from "../../protocols/mapper";

export interface UpdateAccountEntry {
  id: string;
  role: string;
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmationPassword: string;
}

export interface UpdateAccount {
  id: string;
  role: string;
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmationPassword: string;
}

export class UpdateAccountUseCaseMapper
  implements Mapper<Partial<UpdateAccountEntry>, Partial<UpdateAccount>>
{
  toUseCase(data: UpdateAccountEntry): UpdateAccount {
    return {
      id: data.id,
      role: data.role,
      name: data.name,
      email: data.email,
      ...(data?.oldPassword && { oldPassword: data.oldPassword }),
      ...(data?.password && { password: data.password }),
      ...(data?.confirmationPassword && {
        confirmationPassword: data.confirmationPassword,
      }),
    };
  }
}
