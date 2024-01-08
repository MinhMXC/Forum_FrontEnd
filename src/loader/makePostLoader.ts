import fetchWithHeader from "../helper/fetchWithHeader";

export default async function makePostLoader() {
    return await fetchWithHeader("/tags", "GET")
}