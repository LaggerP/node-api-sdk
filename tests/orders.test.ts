import ApiClient from "../src/index";
import credentialsConfig from './credentialsConfig'

const client = new ApiClient(credentialsConfig)


describe('Test for order integrations', () => {
    it('GET ORDER - get an order by id', async () => {
        let order = await client.getOrder(process.env.ORDER_ID || '1')
        expect(order.order_id).toEqual(process.env.ORDER_ID)
    })
})

describe('Test for checkout integration', () => {
    it('CHECKOUT - create an link order', async () => {
        let order = await client.checkout({
            amount: "10.90",
            description: "Venta",
            username: process.env.USERNAME || "",
            callback_fail: "https://www.google.com/search?q=error",
            callback_success: "https://www.google.com/search?q=success"
        })
        expect(order).toHaveProperty('uuid')
    })
})

