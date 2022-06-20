import dotenv from "dotenv"
dotenv.config()

const integrationCreds = {
    credentials: {
        username: process.env.USERNAME || "",
        clientId: process.env.CLIENT_ID || "",
        clientSecretId: process.env.CLIENT_SECRET_ID || ""
    },
    devMode: true, //set true if you want to test your integration
}

export default integrationCreds 