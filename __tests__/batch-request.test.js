const { batchRequest } = require('../batch-request')

describe('batch-request', () => {
  describe('successful requests', () => {
    it('should return successful responses', async () => {
      // assign
      const data = ["customer_id_100", "customer_id_101"]
      const request = customerId => Promise.resolve({ customerId })
      // act
      const result = await batchRequest(data, request)
      // assert
      expect(result).toMatchObject({
        batchFailed: [],
        batchNumberFailed: [],
        batchSucceeded: [
          "customer_id_100",
          "customer_id_101"
        ],
        response: [
          { customerId: "customer_id_100" },
          { customerId: "customer_id_101" }
        ]
      })
    })
  })

  describe('failing requests', () => {
    it('should return failed requests', async () => {
      // assign
      const data = ["customer_id_100", "customer_id_101"]
      const request = customerId => Promise.reject({ customerId })
      // act
      const result = await batchRequest(data, request)
      // assert
      expect(result).toMatchObject({
        batchFailed: [
          "customer_id_100",
          "customer_id_101"
        ],
        batchNumberFailed: [0],
        batchSucceeded: [],
        response: []
      })
    })
  })
})