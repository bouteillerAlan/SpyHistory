
async function getQuests (link,version) {
        // fetch data
    const data = await fetch(`${link}${version}/quests?ids=all`, {
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