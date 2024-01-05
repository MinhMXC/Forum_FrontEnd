import {NavigateFunction} from "react-router-dom";
import fetchWithHeader from "./fetchWithHeader";

export default function signOut(navigate: NavigateFunction) {
    return async () => {
        await fetchWithHeader("/auth/sign_out", "DELETE")
        navigate("/")
    }
}