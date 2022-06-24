import ApiClient from "../src/index";
import credentialsConfig from './credentialsConfig'

const client = new ApiClient(credentialsConfig)


describe('Test for order integrations', () => {
    it('GET ORDER - get an order by id', async () => {
        let order = await client.getOrder(process.env.ORDER_ID || '1')
        const {http_status, body} = order
        expect(http_status).toEqual(200)
        expect(body.order_id).toEqual(process.env.ORDER_ID)
    })
})

describe('Test for checkout integration', () => {
    it('CHECKOUT - create an link order', async () => {
        let checkout = await client.checkout({
            amount: "10.90",
            description: "Venta",
            username: process.env.USERNAME || "",
            callback_fail: "https://www.google.com/search?q=error",
            callback_success: "https://www.google.com/search?q=success"
        })
        const {http_status, body} = checkout
        expect(http_status).toEqual(200) //Needs to change, API should return 201 http code not 200.
        expect(body).toHaveProperty('uuid')
    })
})

