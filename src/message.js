const defaults = (opts = {}) => {
  const { groupId, queueUrl } = opts
  return {
    groupId,
    queueUrl,
  }
}

// const schema = {
//   userEmail: 'String'
// }

const createAttributeFactory = (schema) => (data, fieldId) => {
  const typeName = schema[fieldId] || 'String'
  return {
    [fieldId]: {
      DataType: typeName,
      StringValue: data[fieldId]
    }
  }  
}


const createMessageAttributes = (schema) => {
  const createAttribute = createAttributeFactory(schema)
  return (data) => {
    const MessageAttributes = data.reduce((acc, item) => {
      const { label } = item
      return {
        ...acc,
        ...createAttribute(item)
      }
    }, {})
    return {
      MessageAttributes
    }
  }
}

const createMessageFactory = (opts = {}) => ({ id, groupId, data}) => {
  opts = {
    ...defaults(opts),
    ...opts
  }

  const { queueUrl, uniqueKey } = opts
  return {
    MessageAttributes: createMessageAttributes(data),
    MessageBody: JSON.stringify(data),
    MessageDeduplicationId: id || data[uniqueKey],
    MessageGroupId: groupId,
    QueueUrl: queueUrl  
  }
}

module.exports = {
  createMessageFactory
}
