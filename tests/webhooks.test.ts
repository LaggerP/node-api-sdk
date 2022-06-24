import ApiClient from "../src/index";
import credentialsConfig from './credentialsConfig'

const client = new ApiClient(credentialsConfig)


describe('Test for webhooks integrations', () => {
    it('WEBHOOK - get failed notifications with at least one item', async () => {
        let order = await client.getFailedNotifications()
        const {http_status, body} = order
        expect(http_status).toEqual(200)
        expect(body).toHaveProperty('notifications')
        expect(body.notifications.length > 0).toBe(true)
    })
})
