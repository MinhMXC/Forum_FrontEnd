import fetchWithHeader from "../helper/fetchWithHeader";

export default async function allPostLoader() {
    const res = await fetchWithHeader(`http://127.0.0.1:5000/posts`, "GET")
    if (res.status === "error")
        throw new Response(res.message, { status: 404 })

    return res
}