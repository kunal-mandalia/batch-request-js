# batch-request-js [![CircleCI](https://circleci.com/gh/kunal-mandalia/batch-request-js.svg?style=svg)](https://circleci.com/gh/kunal-mandalia/batch-request-js)
Batch promise based requests to overcome network limitations or API restrictions

## Install
- `yarn add batch-request-js`

## Tests

- `yarn test-test` to run unit tests
- `yarn test-e2e` to run e2e tests
- `yarn test-ci` to run both unit and e2e tests

## Usage

Suppose we'd like to fetch thousands of customers from an API. To avoid network limitations or rate limiting issues, we can batch the requests:


```js
// node.js
const batchRequest = require('batch-request-js')


async function getCustomers () {
  // define array of input data e.g. customerIds
  const customerIds = ['100', '101', '102', ... ]
  // define the async request to perform against each data input
  const request = (customerId) => fetch(`${API_ENDPOINT}/${customerId}`).then(response => response.json())

  // fetch customers in batches of 100, delaying 200ms inbetween each batch request
  const { error, data } = await batchRequest(customerIds, request, { batchSize: 100, delay: 200 })

  // Data from successful requests
  console.log(data) // [{ customerId: '100', ... }, ...]

  // Failed requests
  console.log(error) // [{ record: "101", error: [Error: Customer not found] }, ...]
}
```

## Example

```js
// node.js
const batchRequest = require('batch-request-js')

async function getData () {
  // setup a 100 test records
  const records = Array(100).fill(0).map((d, i) => ({ item: i }))
  // all requests will succeed and be timestamped
  const request = record => Promise.resolve({ ...record, timestamp: Date.now() })
  // batch requests 20 at a time, delaying half a second after each batch request
  const result = await batchRequest(records, request, { batchSize: 20, delay: 500 })
  console.log(result)
//   { 
//     error: [],
//     data: [
//        { record: 0, timestamp: 1533552890663 },
//        { record: 1, timestamp: 1533552890663 },
//        { record: 2, timestamp: 1533552890663 },
//        { record: 3, timestamp: 1533552890663 },
//         ...
//     ]
}

getData()
```

## Handling failed batch requests

Rerun batch request with a filtered set of `inputRecords` to just those that failed on the previous attempt.

## Future
Retry logic may be implemented to handle automatically rerunning batch-request for failing requests.

## License
MIT