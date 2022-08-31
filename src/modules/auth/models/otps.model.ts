const param = {
  AttributeDefinitions: [
    {
      AttributeName: "otp_id",
      AttributeType: "S"
    },
    {
      AttributeName: "created_at",
      AttributeType: "S"
    },
    {
      AttributeName: "user_id",
      AttributeType: "S"
    },
    {
      AttributeName: "is_active",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "otp_id",
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
  TableName: "otp_logs",
  GlobalSecondaryIndexes: [{
    IndexName: "otps_index",
    KeySchema: [
      {
        AttributeName: "user_id",
        KeyType: "HASH"
      },
      {
        AttributeName: "is_active",
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