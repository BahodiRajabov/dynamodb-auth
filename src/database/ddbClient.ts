import { DynamoDB } from 'aws-sdk';

export default class DdbClient {
  private static connection: DynamoDB;

  static get instance(): DynamoDB {
    if (!this.connection) {
      this.connection = new DynamoDB({ region: "us-east-1" });
    }
    return this.connection;
  }
}