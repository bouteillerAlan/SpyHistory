
async function getInfoCharacter (link,version,lang,token,character) {
    // over lang
    lang = 'en'
    // fetch data
    const data = await fetch(`${link}${version}/characters/${character}/core?access_token=${token}&lang=${lang}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getInfoCharacter