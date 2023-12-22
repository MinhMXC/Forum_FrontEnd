export default async function userLoader(params: any) {
    const url = "http://127.0.0.1:5000/users/" + params.params.id
    const res = await fetch(url)
    if (res.status === 404)
        throw new Response((await res.json() as any).message, { status: 404 })

    return await res.json()
}