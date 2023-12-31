import Cookies from "js-cookie";

const access_token = "access-token"
const token_type = "token-type"
const client = "client"
const expiry = "expiry"
const uid = "uid"


//TODO: Add Samesite and httponly options
export function saveToken(res: Response) {
    Cookies.set(access_token, res.headers.get(access_token)!)
    Cookies.set(token_type, res.headers.get(token_type)!)
    Cookies.set(client, res.headers.get(client)!)
    Cookies.set(expiry, res.headers.get(expiry)!)
    Cookies.set(uid, res.headers.get(uid)!)
}

