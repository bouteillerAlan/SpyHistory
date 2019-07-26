
// Give the list of the characters of a player
// link string the api fqd
// version string api version
// token string api key

async function getCharacters (link,version,lang,token) {
    // fetch data
    const data = await fetch(`${link}${version}/characters?access_token=${token}&lang=${lang}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getCharacters