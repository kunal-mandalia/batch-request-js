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
        error: [],
        data: [
          { customerId: "customer_id_100" },
          { customerId: "customer_id_101" }
        ]
      })
    })
  })

  describe('failing requests', () => {
    it('should return failed requests', async () => {
      // assign
      const data = ["customer_id_100", "customer_id_101", "customer_id_102"]
      const request = customerId => customerId === "customer_id_100"
        ? Promise.resolve({ customer: { id: customerId } })
        : Promise.reject("Customer not found")
      // act
      const result = await batchRequest(data, request)

      // assert
      expect(result).toMatchObject({
        error: [
          {
            record: "customer_id_101",
            error: new Error("Customer not found")
          },
          {
            record: "customer_id_102",
            error: new Error("Customer not found")
          },
        ],
        data: [
          {
            customer: { id: "customer_id_100" }
          }
        ]
      })
    })
  })
})