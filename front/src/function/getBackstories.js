
async function getBackstories (link,version,token,character) {
    // fetch data
    const data = await fetch(`${link}${version}/characters/${character}/backstory?access_token=${token}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getBackstories