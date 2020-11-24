const getUrls = (keys, {accountId}) => {
  const promises = keys.reduce(async (acc, key) =>  {
    const url = await sqs.getUrl({
      accountId,
      key
    })
    acc[key] = url
    return acc
  }, {})
  return Promise.all(promises)
}

module.exports = {
  getUrls
}