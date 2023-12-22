async function postData(url: string, data: JSON) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export default postData