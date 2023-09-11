export class ErrorResponse {
  body: string;
  headers: { [key: string]: string };
  statusCode: number;

  constructor(
    message = 'An error occurred',
    statusCode = 500,
  ) {
    const body = JSON.stringify({ message });
    this.statusCode = statusCode;
    this.body = body;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
}
