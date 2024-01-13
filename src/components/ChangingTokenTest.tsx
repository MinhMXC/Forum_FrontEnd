import fetchWithHeader from "../helper/fetchWithHeader";

export default function TestToken() {
    return (
        <div>
            <button onClick={() => fetchWithHeader("/user_simple", "GET")}>
                Click Test
            </button>
        </div>
    )
}