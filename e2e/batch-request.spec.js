const fetch = require('node-fetch')
const server = require('./server')
const { batchRequest, batch } = require('../batch-request')

beforeEach(async () => {
    await server.start()
})

afterEach(async () => {
    await server.stop()
})

describe('batch-request (e2e)', () => {
    // assign
    const TIMEOUT = 1000 * 30
    const BATCH_SIZE = 1000
    const ENDPOINT = "http://localhost:5000/query"

    it('should start server', async () => {
        // assign, act
        const response = await fetch('http://localhost:5000/query')
        // assert
        expect(response.status).toBe(200)
    })

    it('should process large payloads in batches', async () => {
        // assign
        jest.setTimeout(TIMEOUT)
        try {
            const items = Array(BATCH_SIZE).fill(0).map((items, i) => i)
            const prerequestFn = () => fetch(ENDPOINT)
            // act
            const result = await batchRequest(items, prerequestFn)
            // assert
            expect(result.batchFailed).toHaveLength(0)
            expect(result.batchSucceeded).toHaveLength(BATCH_SIZE)
        } catch (error) {
            expect(error).toBeFalsy()
        }
    })

    it('should fail on large payloads', async () => {
        expect.assertions(1)
        jest.setTimeout(TIMEOUT)
        try {
            const requests = Array(BATCH_SIZE).fill(0).map(() => fetch(ENDPOINT))
            const result = await Promise.all(requests)
            expect(error).toBeFalsy()
        } catch (error) {
            expect(error).toBeTruthy()
        }
    })
})