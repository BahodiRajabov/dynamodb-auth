import { v4 } from 'uuid';
import ddbClient from '../../../database/ddbClient'
import { ICreateOtp, IOtp } from '../interface/otps.interface';
import moment from 'moment';
import { unmarshall } from '../../shared/utils/utils';


export class OtpsDAO {
  
  async create({ code, userId }: ICreateOtp): Promise<IOtp> {

    const params = {
      TableName: "otp_logs",
      Item: {
        "otp_id": { S: v4() },
        "user_id": { S: userId },
        "code": { S: code },
        "created_at": { S: moment().utc().toISOString() },
        "is_active": { S: "true" },
      },
    };

    await ddbClient.instance.putItem(params).promise();

    const obj = unmarshall(params.Item)

    return {
      otp_id: obj.otp_id,
      user_id: obj.user_id,
      code: obj.code,
      created_at: obj.created_at,
      is_active: obj.is_active,
    }

  }

  async getLastOtp(userId: string): Promise<IOtp> {

    const params = {
      TableName: 'otp_logs',
      IndexName: 'otps_index',
      ExpressionAttributeValues: {
        ':uid': { S: userId },
        ':bln': { S: "true" }
      },
      KeyConditionExpression: 'user_id = :uid AND is_active=:bln',
      ProjectionExpression: 'code, otp_id, created_at, is_active',
      Limit: 1
    };

    const data = await ddbClient.instance.query(params).promise();

    if (!data.Items[0]) return null;

    const obj = unmarshall(data.Items[0])

    return {
      code: obj.code,
      otp_id: obj.otp_id,
      created_at: obj.created_at,
      user_id: obj.user_id,
      is_active: obj.is_active
    }

  }

  async deactivateOtpById(otpId: string, otpCreatedAt: Date): Promise<IOtp> {

    const params = {
      TableName: "otp_logs",
      Key: {
        "otp_id": { "S": otpId },
        "created_at": { "S": String(otpCreatedAt) }
      },
      ExpressionAttributeValues: {
        ":bl": {
          S: "false"
        },
      },
      UpdateExpression: "set is_active=:bl",
      ReturnValues: "ALL_NEW"
    };

    const data = await ddbClient.instance.updateItem(params).promise();

    const obj = unmarshall(data.Attributes)

    return {
      code: obj.code,
      otp_id: obj.otp_id,
      created_at: obj.created_at,
      user_id: obj.user_id,
      is_active: obj.is_active
    }
  }
}


export default OtpsDAO