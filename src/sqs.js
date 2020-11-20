const AWS = require('aws-sdk');
let isAwsConfigured = false

const defaults = {
  region: 'eu-west-1',
  apiVersion: '2012-11-05'
}

const configAWS = (opts = {}) => {
  if (isAwsConfigured) return
  opts = {
    ...defaults,
    ...opts
  }
  const { region } = opts
  // Configure the region 
  AWS.config.update({ region });
  isAwsConfigured = true
}


const create = (opts = {}) => {
  configAWS(opts)

  opts = {
    ...defaults,
    ...opts
  }
  const { apiVersion } = opts

  // Create an SQS service object
  return new AWS.SQS({ apiVersion });
}

const getUrl = (sqs) => (opts) => {
  const params = {
    QueueName: opts.name,
    QueueOwnerAWSAccountId: opts.accountId
  }
  return new Promise((resolve, reject) => {
    sqs.getQueueUrl(params, (err, data) => {
      err ? reject(err) : resolve(data)
    })  
  })
}

module.exports = {
  configAWS,
  getUrl,
  create
}
