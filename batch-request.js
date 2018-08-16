
/**
 * Batch async requests, throttled with a delay
 * to avoid hammering the network
 *  
 * @param {Array} records 
 * @param {Function} request (returns Promise)
 * @param {Object} options 
 * @returns {Object} result { error, data }
 */
const batchRequest = (records, request = () => {}, options = { batchSize: 100, delay: 100 }) => {
  return new Promise(async resolve => {
    let response = []
    let data = []
    let error = []

    for (let i = 0; i < records.length; i += options.batchSize) {
      const batch = records.slice(i, i + options.batchSize)
      // capture individual errors
      // as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour
      const result = await Promise.all(
        batch.map(record => request(record).catch(e => ({ record, error: new Error(e) })))
      )
      response = response.concat(result)
      await delay(options.delay)
    }
    // separate successful requests from errors
    response.forEach(res => {
      res && (res.error instanceof Error) ? error.push(res) : data.push(res)
    })
    resolve({
      error,
      data
    })
  })
}

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  batchRequest,
  delay
}