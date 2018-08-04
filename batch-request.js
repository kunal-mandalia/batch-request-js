
/**
 * Batch async requests, throttled with a delay
 * to avoid hammering the network
 *  
 * @param {Array} data 
 * @param {Function} request 
 * @param {Object} options 
 * @returns {Object} result
 */
const batchRequest = (data, request = () => {}, options = { batchSize: 100, delay: 100 }) => {
  return new Promise(async resolve => {
    let batchSucceeded = []
    let batchFailed = []
    let batchNumberFailed = []

    for (let i = 0; i < data.length; i += options.batchSize) {
      const batch = data.slice(i, i + options.batchSize)
      try {
        await Promise.all(batch.map(request))
        batchSucceeded = batchSucceeded.concat(batch)
        await delay(options.delay)
      } catch (error) {
        batchFailed = batchFailed.concat(batch)
        batchNumberFailed.push(i)
      }
    }
    resolve({ batchFailed, batchSucceeded, batchNumberFailed })
  })
}

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms))


module.exports = {
  batchRequest,
  delay
}