const param = {
  AttributeDefinitions: [
    {
      AttributeName: "session_id",
      AttributeType: "S"
    },
    {
      AttributeName: "created_at",
      AttributeType: "S"
    },
    {
      AttributeName: "token_id",
      AttributeType: "S"
    },
    {
      AttributeName: "is_logged_out",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "session_id",
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
  TableName: "sessions",
  GlobalSecondaryIndexes: [{
    IndexName: "sessions_index",
    KeySchema: [
      {
        AttributeName: "token_id",
        KeyType: "HASH"
      },
      {
        AttributeName: "is_logged_out",
        KeyType: "RANGE"
      }
    ],
    Projection: {
      ProjectionType: "ALL",
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }],
}

export default param