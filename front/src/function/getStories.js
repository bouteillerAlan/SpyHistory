
// Give the story for id array
// link string the api fqd
// version string api version
// ids string list of id (1,2,3)

async function getStories (link,version,lang,ids='all') {
    // fetch data
    const data = await fetch(`${link}${version}/stories?ids=${ids}&lang=${lang}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getStories