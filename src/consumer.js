const defaults = (opts = {}) => {
  let { name } = opts
  name = name || 'unknown'
  return {
    queueUrl: opts.queueUrl,
    handleMessage: (message) => console.log({received: message}),
    batchSize: 10,
    onError: (err) => {
      console.error({error: err.message});
    },
    onProcessingError: (err) => {
      console.error({processingError: err.message});
    },
    onStarting: () => console.log(`Starting SQS consumer ${name}`),
  }
}

const create = (opts = {}) => {
  opts = {
    ...defaults(opts),
    ...opts
  } 
  
  const { queueUrl, handleMessage, batchSize }= opts

  const consumer = Consumer.create({
    queueUrl,
    handleMessage: async (message) => {
        handleMessage(message)
    },
    sqs: new AWS.SQS(),
    batchSize
  });
  
  consumer.on('error', onError);
  
  consumer.on('processing_error', onProcessingError);
  
  onStarting()
  consumer.start();
}

module.exports = {
  create
}

