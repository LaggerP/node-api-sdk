import ApiClient, { CheckoutRequest } from "../../src/index"
import dotenv from "dotenv"
dotenv.config()

const config = {
    credentials: {
        username: process.env.USERNAME || "",
        clientId: process.env.CLIENT_ID || "",
        clientSecretId: process.env.CLIENT_SECRET_ID || ""
    },
    devMode: true,
}

const client = new ApiClient(config)

const req: CheckoutRequest = {
    amount: "10.90",
    description: "Venta",
    username: process.env.USERNAME || "",
    callback_fail: "https://www.google.com/search?q=error",
    callback_success: "https://www.google.com/search?q=success"
}

client.checkout(req)
    .then(r => {
        console.log(r)
    })
    .catch(err => console.error(err))