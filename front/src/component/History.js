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
        const questsNS = await getQuests(env.apiLink,env.apiVersion,this.state.lang)
        const characters = await getCharacters(env.apiLink,env.apiVersion,this.state.lang,this.state.key)

        const seasons = seasonsNS.sort(function(a, b){return a['order']-b['order']})
        const stories = loadHash.orderBy(storiesNS, ['season', 'order'])
        const quests = loadHash.orderBy(questsNS, ['story', 'level']) // for the moment 'level' is the best way for short this thing

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

    // map the data in a single object
    map () {
        const {data} = this.state
        let obj = {}

        // seasons -> stories -> quests -> characters -> questsDone
        data['seasons'].map((season) => {

            // create object key
            obj[season['name']] = {}

            data['stories'].map((story) => {

                // check if story is in seasons and store it
                if (story['season'] === season['id']) {

                    // if a race is set
                    const storyName = story['races'] ? story['name']+' - '+story['races'] : story['name']

                    obj[season['name']][storyName] = {quests : {}, description : story['description']}

                    // and continue loop
                    data['quests'].map((quest) => {

                        // check if quest is in story and store it
                        if (quest['story'] === story['id']) {
                            obj[season['name']][storyName]['quests'][quest['name']] = {Qid:'', Qlevel:'', status:{}}

                            data['characters'].map((character) => {

                                // stock id and level
                                obj[season['name']][storyName]['quests'][quest['name']]['Qid'] = quest['id']
                                obj[season['name']][storyName]['quests'][quest['name']]['Qlevel'] = quest['level']

                                // check if it's done, if it's the case tag it
                                obj[season['name']][storyName]['quests'][quest['name']]['status'][character] = data['questsDone'][character].includes(quest['id']) ? 1 : 0

                            })
                        }
                    })
                }
            })
        })

        // return the map
        return obj
    }

    render() {
        const {loading, data} = this.state

        if (data) {
            console.log(data)
            const test = this.map()
            console.log(test)
        }

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
                                                                                    <span className={data.questsDone[character].includes(quest['id']) ? '' : 'grey-text'}>
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