import Cookies from "js-cookie";
import APP_CONSTANTS from "./ApplicationConstants";
import {saveToken} from "./tokenFunctions";

const access_token = "access-token"
const token_type = "token-type"
const client = "client"
const expiry = "expiry"
const uid = "uid"

async function fetchWithHeader(url: string, method: string, data: (JSON | undefined) = undefined) {
    try {
        const response = await fetch(APP_CONSTANTS.BACKEND_URL + url, {
            method: method,
            headers: {
                "content-type": "application/json",
                access_token: Cookies.get(access_token)!,
                token_type: Cookies.get(token_type)!,
                client: Cookies.get(client)!,
                expiry: Cookies.get(expiry)!,
                uid: Cookies.get(uid)!,
            },
            body: data === undefined ? undefined : JSON.stringify(data)
        })

        if (response.headers.get(access_token)) {
            saveToken(response)
        }

        return await response.json()
    } catch (error) {
        return error
    }
}

export default fetchWithHeader