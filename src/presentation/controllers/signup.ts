export class SignUpController {
  async handle(httpRequest: any): Promise<any> {
    const { name, email, password, confirmationPassword } = httpRequest;
    if (!name) {
      return {
        statusCode: 400,
        body: {
          message: "Name is required",
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        message: "Signup is successfull",
      },
    };
  }
}
