const getAuthor = async(id) => {
    let author
    const cachedAuthor = sessionStorage.getItem(`author-${id}`)
    const timestamp = sessionStorage.getItem(`timestamp-${id}`)
    if (cachedAuthor && timestamp && new Date().getTime() - Number(timestamp) < 45 * 60 * 1000) {
        author.value = JSON.parse(cachedAuthor)
    } else {
        sessionStorage.removeItem(`author-${id}`)
        sessionStorage.removeItem(`timestamp-${id}`)

    let url = `${process.env.VUE_APP_SERVER_URL}/user/id/` + id
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    }
    try {
        await fetch(url, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not get author')
            }
            author.value = await response.json()
            sessionStorage.setItem(`author-${id}`, JSON.stringify(author.value))
            sessionStorage.setItem(`timestamp-${id}`, new Date().getTime())
        })
    } catch (error) {
        console.error(error)
    }}
    return author
}

export default getAuthor