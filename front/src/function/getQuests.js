
async function getQuests (link,version,lang) {
        // fetch data
    const data = await fetch(`${link}${version}/quests?ids=all&lang=${lang}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getQuests