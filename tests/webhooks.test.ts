import ApiClient from "../src/index";
import credentialsConfig from './credentialsConfig'

const client = new ApiClient(credentialsConfig)


describe('Test for webhooks integrations', () => {
    it('WEBHOOK - get failed notifications', async () => {
        let order = await client.getFailedNotifications()
        expect(order).toHaveProperty('notifications')
    })
})
