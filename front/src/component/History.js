import React, {Component} from 'react'
import env from '../env'
import M from 'materialize-css'
import loadHash from 'lodash'

import getQuests from '../function/getQuests'
import getCharacters from '../function/getCharacters'
import getDoneQuests from '../function/getDoneQuests'
import getStories from '../function/getStories'
import getSeasons from '../function/getSeasons'

class History extends Component {

    constructor (props) {
        super(props)
        this.state = {
            key : localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : this.props.apiKey,
            lang : localStorage.getItem('lang') ? localStorage.getItem('lang') : this.props.lang,
            loading : true,
            data : false
        }
    }

    // build a object contain all infos
    async getter () {
        const seasonsNS = await getSeasons(env.apiLink,env.apiVersion,this.state.lang)
        const storiesNS = await getStories(env.apiLink,env.apiVersion,this.state.lang)
        const quests = await getQuests(env.apiLink,env.apiVersion,this.state.lang)
        const characters = await getCharacters(env.apiLink,env.apiVersion,this.state.lang,this.state.key)

        const seasons = seasonsNS.sort(function(a, b){return a['order']-b['order']})
        const stories = loadHash.orderBy(storiesNS, ['season', 'order'])

        let questsDone = {}
        for (let i = 0; i<characters.length; i++) {
            questsDone[characters[i]] = await getDoneQuests(env.apiLink,env.apiVersion,this.state.lang,this.state.key,characters[i])
        }

        return {seasons, stories, quests, characters, questsDone}
    }

    componentWillMount () {
        this.getter().then((res) => {
            this.setState({
                loading : false,
                data : res
            })
        })
    }

    // init js
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
        const elems = document.querySelectorAll('.collapsible')
        const options = {}
        M.Collapsible.init(elems, options)
    }

    render() {

        const {loading, data} = this.state

        return (
            <div className="row">
                {loading &&
                    <div className="progress">
                        <div className="indeterminate"> </div>
                    </div>
                }

                {data &&
                    <div>
                        {data['seasons'].map((season) => (
                            <div key={season['id']}>
                                <h4>{season['name']}</h4>

                                <ul className="collapsible popout">
                                    {/*data['stories'] first because it's the right sort*/}
                                    {data['stories'].map((storieD) => (
                                        season['stories'].map((storieS) => (
                                            storieD['id'] === storieS ?
                                                <li key={storieD['id']}>
                                                    <div className="collapsible-header">
                                                        {storieD['name']} {storieD['races']?' - '+storieD['races']:null}
                                                    </div>
                                                    <div className="collapsible-body">

                                                        <div className="grid">
                                                            {data['quests'].map((quest) => (
                                                                quest['story'] === storieD['id'] ?
                                                                    <div key={quest['id']} className={'card'}>

                                                                        <p className={'info'}><small>{storieD['timeline']}</small><small>Qid : {quest['id']}</small></p>
                                                                        <h5 className={'title'}>{quest['name']}</h5>
                                                                        <ul>
                                                                            {data.characters.map((character) => (
                                                                                <li key={quest['id']+character} className={data.questsDone[character].includes(quest['id']) ? 'green' : ''}>
                                                                                    <span className={data.questsDone[character].includes(quest['id']) ? '' : 'blue-grey-text'}>
                                                                                        {data.questsDone[character].includes(quest['id']) ? '🗸 ' : 'x '}
                                                                                        {character}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>

                                                                    </div>
                                                                    : null
                                                            ))}
                                                        </div>

                                                    </div>
                                                </li>
                                                : null
                                        ))
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                }

            </div>
        )
    }

}

export default History