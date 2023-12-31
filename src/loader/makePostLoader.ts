export default async function makePostLoader({params}: any) {
    return await fetch("http://localhost:5000/tags").then(res => res.json())
}