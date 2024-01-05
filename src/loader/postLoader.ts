import fetchWithHeader from "../helper/fetchWithHeader";

export default async function postLoader({params}: any) {
    const res = await fetchWithHeader(`/posts/${params.id}`, "GET")
    if (res.status === "error")
        throw new Response(res.message, { status: 404 })

    return await res
}