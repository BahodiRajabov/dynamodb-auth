import { v4 } from "uuid";
import ddbClient from "../../../database/ddbClient"
import { ICreateArticle, IArticle } from "../interface/articles.interface";
import moment from "moment";
import { generateUpdateQuery, unmarshall } from "../../shared/utils/utils";

class ArticlesDAO {

  async create({
    description,
    is_private,
    title
  }: ICreateArticle, user_id: string): Promise<IArticle> {

    const params = {
      TableName: "articles",
      Item: {
        "article_id": { S: v4() },
        "description": { S: description },
        "title": { S: title },
        "user_id": { S: user_id },
        "is_private": { S: String(is_private) },
        "created_at": { S: moment().utc().toISOString() },
      },

    };

    await ddbClient.instance.putItem(params).promise();

    const obj = unmarshall(params.Item)

    return {
      article_id: obj.article_id,
      description: obj.description,
      title: obj.title,
      user_id: obj.user_id,
      is_private: obj.is_private,
      created_at: obj.created_at
    }
  }

  async getById(id: string): Promise<IArticle> {

    const params = {
      TableName: "articles",
      ExpressionAttributeValues: {
        ":aid": { S: id }
      },
      KeyConditionExpression: "article_id = :aid",
      ProjectionExpression: "article_id, description, title, is_private, created_at, user_id",
      Limit: 1
    };

    const data = await ddbClient.instance.query(params).promise();

    if (!data.Items[0]) return null;

    const obj = unmarshall(data.Items[0])

    return {
      article_id: obj.article_id,
      description: obj.description,
      title: obj.title,
      user_id: obj.user_id,
      is_private: obj.is_private,
      created_at: obj.created_at
    }
  }

  async getAllByUserId(id: string, type: "all" | "privates" | "publics") {

    const conditions = {
      all: {
        ExpressionAttributeValues: {
          ":uid": { S: id },
        },
      },
      privates: {
        FilterExpression: "is_private = :fl ",
        ExpressionAttributeValues: {
          ":uid": { S: id },
          ":fl": { S: "true" },
        },
      },
      publics: {
        FilterExpression: "is_private = :fl ",
        ExpressionAttributeValues: {
          ":uid": { S: id },
          ":fl": { S: "false" },
        },
      }
    }

    const params = {
      TableName: 'articles',
      IndexName: 'articles_index',
      ...conditions[type],
      KeyConditionExpression: "user_id = :uid",
      ProjectionExpression: 'article_id, description, title, is_private, created_at, user_id',
    };

    const data = await ddbClient.instance.query(params).promise();

    const items = data.Items.map((item) => {
      return unmarshall(item)
    })

    return items

  }

  async updateById(article: IArticle, body: Partial<ICreateArticle>): Promise<IArticle> {

    const queryPart = generateUpdateQuery(body)

    const params = {
      TableName: "articles",
      Key: {
        "article_id": { "S": article.article_id },
        "is_private": { "S": String(article.is_private) }
      },
      ExpressionAttributeValues: queryPart.ExpressionAttributeValues,
      UpdateExpression: queryPart.UpdateExpression,
      ReturnValues: "ALL_NEW"
    };


    const data = await ddbClient.instance.updateItem(params).promise();

    const obj = unmarshall(data.Attributes)

    return {
      article_id: obj.article_id,
      description: obj.description,
      title: obj.title,
      user_id: obj.user_id,
      is_private: obj.is_private,
      created_at: obj.created_at
    }

  }
}

export default ArticlesDAO