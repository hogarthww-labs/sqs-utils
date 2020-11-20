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

const defaults = {
  createOnSend,
  createOnError
}

const sendMessageFactory = ({opts, sqs}) => (res, data) => {
  opts = {
    ...defaults,
    ...opts || {}
  }
  const { createOnSend, createOnError } = opts
  // send the order data to the SQS queue
  let sendSqsMessage = sqs.sendMessage(data).promise();      
  sendSqsMessage.then(createOnSend(res)).catch(createOnError(res))
}

module.exports = {
  sendMessageFactory
}
