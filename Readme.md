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

## Create SQS instance

```js
const { sqs } = require('sqs-utils')

const apiVersion = '2012-11-05'

let $sqs
$sqs = sqs.create({
  apiVersion,
  region: 'eu-west-1'
})

// or using default apiVersion
$sqs = sqs.create({
  region: 'eu-west-1'
})
```

## Get SQS urls

Lookup SQS resource URLs dynamically

```js
const { queues } = require('sqs-utils')
const { getUrls } = queues
const queueNames = ['success', 'failure']

// accountId is the AWS account ID
const urlMap = await getUrls(queueNames, { accountId })
```

## Create Producer

```js
const { producer } = require('sqs-utils')

producer.create({
  queueUrl: urlMap.success,
  region: 'eu-west-1',
  secure: true,
  accessKeyId: Process.env.ACCESS_KEY_ID
  secretAccessKey: Process.env.SECRET_ACCESS_KEY
})
```

## Create Consumer

```js
const { consumer } = require('sqs-utils')

const consumers = {}
consumers.success = consumer.create({
  queueUrl: urlMap.success,
  handleMessage: (message) => console.log('success', message)
})
```

## Messages

```js
const { consumer } = require('sqs-utils')
const createMessage = createMessageFactory({
  queueUrl: urlMap.success,
  uniqueKey: 'id'
})

const data = {
  type: 'product',
  assetPath: 's3://...',
  tags: [
    "apple",
    "pie"
  ]
}
const groupId = 'ai-tags'
const message = createMessage({data, id, groupId})
await producer.send(message)
```

## Message sender

```js
const { send } = require('sqs-utils')
const { sendMessageFactory } = send
const sendMessage = sendMessageFactory({
    queueUrl: urlMap.success,
    createOnSend: () => {
      // ...
    },
    createOnError
})

// inside a route or anywhere that response is available
sendMessage(res, data)
```

Default send event handler factories

```js
const createOnSend = (res) => (data) => {
  const id = data.MessageId
  console.log(`SUCCESS: ${id}`);
  res.send({success: id});
}

const createOnError = (res) => (err) => {
  console.error(`ERROR: ${err}`);
  // send email to emails API
  res.send({error: err});        
}
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
