import { v4 } from 'uuid';
import ddbClient from '../../../database/ddbClient'
import { ICreateUserSession, IUserSession } from '../interface/sessions.interface';
import moment from 'moment';
import { unmarshall } from '../../shared/utils/utils';


export class SessionDAO {

  async create({ device, remoteIp, tokenId, userId }: ICreateUserSession): Promise<IUserSession> {

    const params = {
      TableName: "sessions",
      Item: {
        "session_id": { S: v4() },
        "user_id": { S: userId },
        "device": { S: device },
        "remoteIp": { S: remoteIp },
        "token_id": { S: tokenId },
        "is_logged_out": { S: "false" },
        "logged_out_at": { S: "" },
        "created_at": { S: moment().utc().toISOString() },
      },
    };

    await ddbClient.instance.putItem(params).promise();

    const obj = unmarshall(params.Item)

    return {
      session_id: obj.session_id,
      user_id: obj.user_id,
      device: obj.device,
      remoteIp: obj.remoteIp,
      token_id: obj.token_id,
      is_logged_out: obj.is_logged_out,
      logged_out_at: obj.logged_out_at,
      created_at: obj.created_at
    }

  }

  async getSessionByTokenId(tokenId: string): Promise<Partial<IUserSession>> {

    const params = {
      TableName: 'sessions',
      IndexName: 'sessions_index',
      ExpressionAttributeValues: {
        ':tid': { S: tokenId }
      },
      KeyConditionExpression: 'token_id = :tid',
      ProjectionExpression: 'session_id, user_id, created_at, is_logged_out',
      Limit: 1
    };

    const data = await ddbClient.instance.query(params).promise();

    if (!data.Items[0]) return null;

    const obj = unmarshall(data.Items[0])

    return {
      session_id: obj.session_id,
      user_id: obj.user_id,
      created_at: obj.created_at,
      is_logged_out: obj.is_logged_out
    }

  }

  deactivateSessionById(id: string) {
  }
}


export default SessionDAO