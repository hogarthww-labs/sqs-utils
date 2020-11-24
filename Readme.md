# SQS Utils

SQS utilities, including

- `Producer`
- `Consumer`
- `getUrls` to get urls of queues

## AWS

```js
const AWS = require('aws-sdk');

// Configure the region 
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
```

## Get SQS urls

```js
const { queues } = require('sqs-utils')
const { getUrls } = queues
const queueNames = ['success', 'failure']

// accountId is the AWS account ID
const urlMap = await getUrls(queueNames, { accountId })
```

## SQS

- [sqs-consumer](https://www.npmjs.com/package/sqs-consumer)
- [sqs-producer](https://www.npmjs.com/package/sqs-producer)

## Producer

```js
const { Producer } = require('sqs-producer');

// create simple producer
const producer = Producer.create({
  queueUrl: 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name',
  region: 'eu-west-1'
});

// create custom producer (supporting all opts as per the API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property)
const producer = Producer.create({
  queueUrl: 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name',
  region: 'eu-west-1',
  accessKeyId: 'yourAccessKey',
  secretAccessKey: 'yourSecret'
});

// send messages to the queue
await producer.send(['msg1', 'msg2']);
```

## Consumer

```js
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.eu-west-1.amazonaws.com/account-id/queue-name',
  handleMessage: async (message) => {
    // do some work with `message`
  }
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();
```
