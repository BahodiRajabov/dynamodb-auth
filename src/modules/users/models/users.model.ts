const param = {
  AttributeDefinitions: [
    {
      AttributeName: "user_id",
      AttributeType: "S"
    },
    {
      AttributeName: "created_at",
      AttributeType: "S"
    },
    {
      AttributeName: "email",
      AttributeType: "S"
    },
    {
      AttributeName: "full_name",
      AttributeType: "S"
    },
  ],
  KeySchema: [
    {
      AttributeName: "user_id",
      KeyType: 'HASH'
    },
    {
      AttributeName: "created_at",
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: "users",
  GlobalSecondaryIndexes: [{
    IndexName: "users_index",
    KeySchema: [
      {
        AttributeName: "email",
        KeyType: "HASH"
      },
      {
        AttributeName: "full_name",
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