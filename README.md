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
  const { error, data } = await batchRequest(customerIds, request, { batchSize: 100, delay: 200 })

  // Data from successful requests
  console.log(data[0]) // { customerId: '100', ... }

  // Failed requests
  console.log(error[0]) // { record: "101", error: [Error: Customer not found] }
}
```

## Handling failed batch requests

Rerun batch request with a filtered set of `inputRecords` to just those that failed on the previous attempt.

## Future
Retry logic may be implemented to handle automatically rerunning batch-request for failing requests.

## License
MIT