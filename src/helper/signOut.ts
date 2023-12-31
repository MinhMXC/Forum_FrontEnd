import Cookies from "js-cookie";
import {NavigateFunction} from "react-router-dom";

const access_token = "access-token"
const token_type = "token-type"
const client = "client"
const expiry = "expiry"
const uid = "uid"

export default function signOut(navigate: NavigateFunction) {
    return () => {
        fetch("http://localhost:5000/auth/sign_out", {
            method: "DELETE",
            headers: {
                access_token: Cookies.get(access_token)!,
                token_type: Cookies.get(token_type)!,
                client: Cookies.get(client)!,
                expiry: Cookies.get(expiry)!,
                uid: Cookies.get(uid)!,
            }
        })
        navigate("/")
    }
}