export class SignUpController {
  async handle(httpRequest: any): Promise<any> {
    const { name, email, password, confirmationPassword } = httpRequest;
    if (!name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
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
