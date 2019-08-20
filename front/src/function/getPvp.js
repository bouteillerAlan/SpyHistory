async function getPvp (link,version,token) {
    // fetch data
    const data = await fetch(`${link}${version}/pvp/stats?access_token=${token}`, {
        method : 'GET',
        mode : 'cors'
    })
        .then(res => res.json())
        .then((res) => {
            return res
        })

    return data
}

export default getPvp