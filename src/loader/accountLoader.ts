import fetchWithHeader from "../helper/fetchWithHeader";

export default async function accountLoader() {
    const user = await fetchWithHeader("/user_simple", "GET")
    if (user.status === "error") {
        throw new Response(user.message, { status: 401 })
    }

    const res = await fetchWithHeader(`/users/${user.data.id}`, "GET")
    if (res.status === "error")
        throw new Response(res.message, { status: 404 })

    return res.data
}