export default async function allPostLoader() {
    const url = "http://127.0.0.1:5000/posts"
    const res = await fetch(url)
    return await res.json()
}