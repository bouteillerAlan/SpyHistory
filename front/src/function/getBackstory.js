
// Give the back story for id array
// link string the api fqd
// version string api version
// ids string list of id (1,2,3)

async function getBackstory (link,version,ids='all') {
    // fetch data
    const data = await fetch(`${link}${version}/backstory/answers?ids=${ids}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getBackstory