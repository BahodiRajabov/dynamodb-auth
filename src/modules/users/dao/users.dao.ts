import { v4 } from "uuid";
import ddbClient from "../../../database/ddbClient"
import { ICreateUser, IUser } from "../interface/users.interface";
import moment from "moment";
import { unmarshall } from "../../shared/utils/utils";

class UsersDAO {

  async create({
    full_name,
    email,
    password,
  }: ICreateUser): Promise<IUser> {

    const params = {
      TableName: "users",
      Item: {
        "user_id": { S: v4() },
        "email": { S: email },
        "password": { S: password },
        "full_name": { S: full_name },
        "created_at": { S: moment().utc().toISOString() },
        "is_verified": { BOOL: false },
      },

    };

    await ddbClient.instance.putItem(params).promise();

    const obj = unmarshall(params.Item)

    return {
      user_id: obj.user_id,
      email: obj.email,
      password: obj.password,
      full_name: obj.full_name,
      created_at: obj.created_at,
      is_verified: obj.is_verified
    }
  }

  async getById(id: string): Promise<IUser> {

    const params = {
      TableName: "users",
      ExpressionAttributeValues: {
        ":uid": { S: id }
      },
      KeyConditionExpression: "user_id = :uid",
      ProjectionExpression: "email, full_name, user_id, created_at, is_verified, password",
      Limit: 1
    };

    const data = await ddbClient.instance.query(params).promise();

    if (!data.Items[0]) return null;

    const obj = unmarshall(data.Items[0])

    return {
      email: obj.email,
      full_name: obj.full_name,
      user_id: obj.user_id,
      created_at: obj.created_at,
      is_verified: obj.is_verified,
      password: obj.password,
    }
  }

  async getAllUsers() {

    const params = {
      ProjectionExpression: "email, full_name, user_id, created_at",
      TableName: "users",
    };

    const data = await ddbClient.instance.scan(params).promise();

    return data

  }

  async getByEmail(email: string): Promise<IUser> {

    const params = {
      TableName: 'users',
      IndexName: 'users_index',
      ExpressionAttributeValues: {
        ":em": { S: email },
      },
      KeyConditionExpression: 'email = :em',
      ProjectionExpression: 'email, full_name, user_id, created_at, is_verified, password',
      Limit: 1
    };

    const data = await ddbClient.instance.query(params).promise();

    if (!data.Items[0]) return null;

    const obj = unmarshall(data.Items[0])

    return {
      email: obj.email,
      full_name: obj.full_name,
      user_id: obj.user_id,
      created_at: obj.created_at,
      is_verified: obj.is_verified,
      password: obj.password,
    }

  }

  async verify(userId: string, createdAt: Date): Promise<IUser> {

    const params = {
      TableName: "users",
      Key: {
        "user_id": { "S": userId },
        "created_at": { "S": String(createdAt) }
      },
      ExpressionAttributeValues: {
        ":bl": {
          BOOL: true
        },
      },
      UpdateExpression: "set is_verified=:bl",
      ReturnValues: "ALL_NEW"
    };


    const data = await ddbClient.instance.updateItem(params).promise();

    const obj = unmarshall(data.Attributes)

    return {
      email: obj.email,
      full_name: obj.full_name,
      user_id: obj.user_id,
      created_at: obj.created_at,
      is_verified: obj.is_verified,
      password: obj.password,
    }

  }
}

export default UsersDAO