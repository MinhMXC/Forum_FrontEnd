export default async function postLoader(params: any) {
    const url = "http://127.0.0.1:5000/posts/" + params.params.id
    const res = await fetch(url)
    if (res.status === 404)
        throw new Response((await res.json() as any).message, { status: 404 })

    return await res.json()
}