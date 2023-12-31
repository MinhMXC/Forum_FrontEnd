import Cookies from "js-cookie";

const access_token = "access-token"
const token_type = "token-type"
const client = "client"
const expiry = "expiry"
const uid = "uid"

async function fetchWithHeader(url: string, method: string, data: (JSON | undefined) = undefined) {
    try {
        const response = await fetch(url, {
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

        return await response.json()
    } catch (error) {
        return error
    }
}

export default fetchWithHeader