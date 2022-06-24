import fetch from "isomorphic-unfetch"
import { Response } from "node-fetch"

export interface ApiCredentials {
	username: string
	clientId: string
	clientSecretId: string
}

export interface ApiClientConfig {
	devMode?: boolean
	credentials: ApiCredentials
}

/**
* Interface for API Checkout `Request`
*/
export interface CheckoutRequest {
	amount: string
	description: string
	username: string
	callback_fail: string
	callback_success: string
	origin?: string
	notification_url?: string
}

/**
* Interface for API Checkout `Responses`, where `body` values are description & internal code, error has the `error` message and `http_status` value is http code from the API
*/
export interface ResponseBody {
	http_status: number,
	body?: any,
	error?: any
}

export default class ApiClient {
	devMode: boolean
	credentials: ApiCredentials
	authPath: string
	basePath: string

	constructor(config: ApiClientConfig) {
		this.devMode = config.devMode || false
		this.credentials = config.credentials
		this.authPath = config.devMode ? "https://auth.stage.ua.la/1/auth/token" : "https://auth.prod.ua.la/1/auth/token"
		this.basePath = config.devMode ? "https://checkout.stage.ua.la/1" : "https://checkout.prod.ua.la/1"
	}

	/**
	 * Create auth token to be able to make https calls
	 */
	async auth() {
		const res = await fetch(this.authPath, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"user_name": this.credentials.username,
				"client_id": this.credentials.clientId,
				"client_secret_id": this.credentials.clientSecretId,
				"grant_type": "client_credentials"
			})
		})

		return res.json()
	}

	/**
	 * Create order payment link
	 * @param {CheckoutRequest} req 
	 * @returns {ResponseBody}
	 */
	async checkout(req: CheckoutRequest): Promise<ResponseBody> {
		try {
			const { access_token } = await this.auth()
			const res = await fetch(`${this.basePath}/checkout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					"amount": req.amount,
					"description": req.description,
					"userName": req.username,
					"callback_fail": req.callback_fail,
					"callback_success": req.callback_success,
					...(req.origin && { "origin": req.origin })
				})
			})

			return {
				http_status: res.status, body: await res.json()
			}
		} catch (error) {
			return { http_status: 500, error: { error } }

		}

	}

	/**
	 * Get order by id
	 * @param {string} id Order id
	 * @returns {ResponseBody}
	 */
	async getOrder(id: string): Promise<ResponseBody> {
		try {
			const { access_token } = await this.auth()
			let order = await fetch(`${this.basePath}/order/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
			return { http_status: order.status, body: await order.json() }
		} catch (error) {
			return { http_status: 500, error: { error } }
		}
	}

	/**
	 * Get notifications that could not be notified to the client
	 * @returns {ResponseBody}
	 */
	async getFailedNotifications(): Promise<ResponseBody> {
		try {
			const { access_token } = await this.auth()
			const failedNotifications = await fetch(`${this.basePath}/notifications/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
			return {
				http_status: failedNotifications.status,
				body: await failedNotifications.json()
			}
		} catch (error) {
			return { http_status: 500, error: { error } }
		}
	}
}