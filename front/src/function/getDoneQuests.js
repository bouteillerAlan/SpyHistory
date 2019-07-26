
async function getDoneQuests (link,version,lang,token,character) {
    // fetch data
    const data = await fetch(`${link}${version}/characters/${character}/quests?access_token=${token}&lang=${lang}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getDoneQuests