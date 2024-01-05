import APP_CONSTANTS from "../helper/ApplicationConstants";

export default async function userLoader({params}: any) {
    const url = APP_CONSTANTS.BACKEND_URL + "/users/" + params.id
    const res = await fetch(url)
    if (res.status === 404)
        throw new Response((await res.json() as any).message, { status: 404 })

    return await res.json()
}