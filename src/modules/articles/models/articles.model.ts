const param = {
  AttributeDefinitions: [
    {
      AttributeName: "article_id",
      AttributeType: "S"
    },
    {
      AttributeName: "created_at",
      AttributeType: "S"
    },
    {
      AttributeName: "is_private",
      AttributeType: "S"
    },
    {
      AttributeName: "user_id",
      AttributeType: "S"
    },
  ],
  KeySchema: [
    {
      AttributeName: "article_id",
      KeyType: 'HASH'
    },
    {
      AttributeName: "is_private",
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "articles",
  GlobalSecondaryIndexes: [{
    IndexName: "articles_index",
    KeySchema: [
      {
        AttributeName: "user_id",
        KeyType: "HASH"
      },
      {
        AttributeName: "created_at",
        KeyType: "RANGE"
      }
    ],
    Projection: {
      ProjectionType: "ALL"
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }],
}

export default param