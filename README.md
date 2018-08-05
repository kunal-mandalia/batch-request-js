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


```(javascript)
// node.js
const batchRequest = require('batch-request-js')


async function getCustomers () {
  const customerIds = ['100', '101', '102', ... ]
  const request = (customerId) => fetch(`${API_ENDPOINT}/${customerId}`).then(response => response.json())

  // fetch customers in batches of 100, delaying 200ms inbetween each batch request
  const result = await batchRequest(customerIds, request, { batchSize: 100, delay: 200 })
  const  { batchFailed, batchNumberFailed, batchSucceeded, response } = result

  // Data from successful batches
  console.log(response[0]) // { customerId: '100', ... }

  // Failed batch numbers
  console.log(batchNumberFailed) // [7, 9] 
}
```

## Handling failed batch requests

`batchNumberFailed` indicates the batches which failed. Failure here means that at least one of the requests within the batch failed.

- If your call is idemponent e.g. a GET request which has no side effects: filter the `data` set to the failing batch ranges and rerun the batch-request.

- If your call is not idemponent e.g. a POST request to create a customer by id: find those customers within the failing batches not created within the db and rerun the batch-request.

## Future
Retry logic may be implemented to handle automatically rerunning batch-request for failing batches

## License
MIT