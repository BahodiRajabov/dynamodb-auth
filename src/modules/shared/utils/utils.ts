import { DynamoDB } from "aws-sdk";

export function getFirst(v: any[]) {
  return v[0];
}

export function generateRandomDigit(max: number) {
  return Math.round(Math.random() * 10 ** max)
    .toString()
    .padEnd(max, '0');
}


export function getCurrentDate() {
  return Date.now();
}

export function getExpireDate(date: Date) {
  const dateTimestamp = new Date(date);
  return dateTimestamp.getTime() + (60 * 1000)
}

export function parseJson(value: string) {
  return JSON.parse(value)
}

export function unmarshall(item: DynamoDB.AttributeMap) {
  return DynamoDB.Converter.unmarshall(item, {
    convertEmptyValues: true
  })
}

export function generateUpdateQuery(fields: any) {
  let exp = {
    UpdateExpression: 'set',
    ExpressionAttributeValues: {}
  }
  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += ` ${key} = :${key},`;
    exp.ExpressionAttributeValues[`:${key}`] = {"S":item}
  })
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
  return exp
}