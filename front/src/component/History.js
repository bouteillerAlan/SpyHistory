import React, {Component} from 'react'
import env from '../env'
import psl from '../personal_story_line'
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
        const elems_collapsible = document.querySelectorAll('.collapsible')
        const elems_tooltipped = document.querySelectorAll('.tooltipped')
        const options_collapsible = {}
        const options_tooltipped = {}
        M.Collapsible.init(elems_collapsible, options_collapsible)
        M.Tooltip.init(elems_tooltipped, options_tooltipped)
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
                            obj[season['name']][storyName]['quests'][quest['id']] = {Qname :'', Qid:'', Qlevel:'', status:{}}

                            data['characters'].map((character) => {

                                // stock id and level
                                obj[season['name']][storyName]['quests'][quest['id']]['Qname'] = quest['name']
                                obj[season['name']][storyName]['quests'][quest['id']]['Qid'] = quest['id']
                                obj[season['name']][storyName]['quests'][quest['id']]['Qlevel'] = quest['level']

                                // check if it's done, if it's the case tag it
                                obj[season['name']][storyName]['quests'][quest['id']]['status'][character] = data['questsDone'][character].includes(quest['id']) ? 1 : 0

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
        const map = data ? this.map() : null

        if (data) {
            console.log(data)
            const test = this.map()
            console.log(test)
            psl['Asura'].map((quest) => {console.log(quest)})
        }

        return (
            <div className="row">
                {loading &&
                    <div className="progress">
                        <div className="indeterminate"> </div>
                    </div>
                }

                {map &&
                    <div>
                        {Object.keys(map).map((season) => (
                            <div key={season}>
                                <h4><blockquote>{season}</blockquote></h4>

                                <ul className="collapsible popout">

                                    {Object.keys(map[season]).map((story) => (
                                        <li key={story}>
                                            <div className="collapsible-header">
                                                {story}
                                                {map[season][story]['description'] &&
                                                    <span className="new badge tooltipped hide-on-med-and-down" data-badge-caption="Info." data-position="left" data-tooltip={map[season][story]['description']}> </span>
                                                }
                                            </div>
                                            <div className="collapsible-body">

                                                <div className="ecran">
                                                    {psl[story.split('- ')[1]] && psl[story.split('- ')[1]].map((quest) => (
                                                        <div className="grid">
                                                            {quest.map((line) => (
                                                                <div className="line">
                                                                    {line.map((id) => (
                                                                        <div className="multi_card">
                                                                            {Array.isArray(id) ?
                                                                                // is a choice
                                                                                id.map((uId) => (
                                                                                    <div className={'card'}>
                                                                                        <p className={'info'}><small>Lvl : {map[season][story]['quests'][uId]['Qlevel']}</small><small>Qid : {map[season][story]['quests'][uId]['Qid']}</small></p>
                                                                                        <h5 className={'title'}>{map[season][story]['quests'][uId]['Qname']}</h5>
                                                                                        <div className={'card_persona'}>
                                                                                            {Object.keys(map[season][story]['quests'][uId]['status']).map((character) => (
                                                                                                <span className={'status ' + (map[season][story]['quests'][uId]['status'][character] ? 'green' : 'red')}>
                                                                                                    <span>{map[season][story]['quests'][uId]['status'][character] ? '🗸 ' : 'x '}</span>
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                                :
                                                                                <div className={'card'}>
                                                                                    <p className={'info'}><small>Lvl : {map[season][story]['quests'][id]['Qlevel']}</small><small>Qid : {map[season][story]['quests'][id]['Qid']}</small></p>
                                                                                    <h5 className={'title'}>{map[season][story]['quests'][id]['Qname']}</h5>
                                                                                    <div className={'card_persona'}>
                                                                                        {Object.keys(map[season][story]['quests'][id]['status']).map((character) => (
                                                                                            <span className={'status ' + (map[season][story]['quests'][id]['status'][character] ? 'green' : 'red')}>
                                                                                                    <span>{map[season][story]['quests'][id]['status'][character] ? '🗸 ' : 'x '}</span>
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </li>
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