import fetchWithHeader from "../helper/fetchWithHeader";

export default async function makePostLoader({params}: any) {
    return await fetchWithHeader("/tags", "GET")
}