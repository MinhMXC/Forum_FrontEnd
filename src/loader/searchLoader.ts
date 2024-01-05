import fetchWithHeader from "../helper/fetchWithHeader";
import parseString from "../helper/parseString";

export default async function searchLoader({params}: any) {
    const res = await fetchWithHeader(`/posts?search=${parseString(params.search)}`, "GET")
    if (res.status === "error")
        throw new Response(res.message, { status: 404 })

    return res
}