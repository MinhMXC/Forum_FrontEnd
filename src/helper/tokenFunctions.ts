import Cookies from "js-cookie";

const access_token = "access-token"
const token_type = "token-type"
const client = "client"
const expiry = "expiry"
const uid = "uid"

export function saveToken(res: Response) {
    Cookies.set(access_token, res.headers.get(access_token)!, { sameSite: "strict" })
    Cookies.set(token_type, res.headers.get(token_type)!, { sameSite: "strict" })
    Cookies.set(client, res.headers.get(client)!, { sameSite: "strict" })
    Cookies.set(expiry, res.headers.get(expiry)!, { sameSite: "strict" })
    Cookies.set(uid, res.headers.get(uid)!, { sameSite: "strict" })
}

