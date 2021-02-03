const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const REGION = "eu-west-1"; //e.g. "us-east-1"
const dbclient = new DynamoDBClient({ region: REGION });
const TABLE_NAME = "command-tips";

/*
const commandSchema = mongoose.Schema({
  title: { type: String, required: [true, 'The title is required.'] },
  tags: { type: String },
  command: { type: String, required: [true, 'The command is required.'] },
  full_description: { type: String },
  helpfull_links: { type: String },
  userAuthId: {type: String, required: [true, 'The auth id is required.']},
  helpfull: {type: Number, default: 0 },
  unhelpfull: {type: Number, default: 0},
  works: {type: Number, default: 0 },
  doesnt_work: {type: Number, default: 0 },
  comments_counts: {type: Number, default: 0 },
  active: { type: Boolean, default: true }
});
*/

const findById = async (commandId) => {
  const params = {
    TableName: TABLE_NAME, //TABLE_NAME
    Key: {
      id: { S: commandId},
    }
  };
  console.log('calling dynamodb using id ' + commandId);
  const data = await dbclient.send(new GetItemCommand(params));
  console.log('dynamody response data %j ', data.Item);
  return data.Item;
}

module.exports = { findById };
