const { Producer } = require('sqs-producer');

const create = (opts = {}) => {
  opts = {
    ...opts
  }
  const producerConfig = {
    queueUrl: opts.queueUrl,
    region: opts.region
  }

  if (opts.secure) {
    if (!(opts.accessKeyId && opts.secretAccessKey)) {
      throw Error('Missing security credentials')
    }
    producerConfig.accessKeyId = opts.accessKeyId
    producerConfig.secretAccessKey = opts.secretAccessKey
  }
  
  // create custom producer (supporting all opts as per the API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property)
  return Producer.create(producerConfig);

}

module.exports = {
  create
}

// send messages to the queue
// await producer.send(['msg1', 'msg2']);

