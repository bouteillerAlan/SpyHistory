import React, {Component} from 'react'
import env from '../env'
import M from 'materialize-css'

import getQuests from '../function/getQuests'
import getCharacters from '../function/getCharacters'
import getDoneQuests from '../function/getDoneQuests'
import getStories from "../function/getStories";


class Stories extends Component {

    constructor (props) {
        super(props)
        this.state = {
            key : this.props.apiKey,
            loading : true,
            error : false,
            quests : false,
            stories : false,
            questsDone : false,
            characters : false
        }
    }

    // async the fetch
    async getDone () {
        // get the list of all characters for one apiKey
        const characters = await getCharacters(env.apiLink,env.apiVersion,this.state.key)

        // store
        this.setState({
            characters : characters
        })

        let obj = {}
        for (let i=0; i<characters.length; i++) {
            obj[characters[i]] = await getDoneQuests(env.apiLink,env.apiVersion,this.state.key,characters[i])
        }

        return obj
    }

    // init js
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
        const elems = document.querySelectorAll('.collapsible')
        const options = {}
        M.Collapsible.init(elems, options)
    }

    groupBy (list, keyGetter) {
        const map = new Map()
        list.forEach((item) => {
            const key = keyGetter(item)
            const collection = map.get(key)
            if (!collection) {
                map.set(key, [item])
            } else {
                collection.push(item)
            }
        })
        return map
    }

    componentWillMount () {
        // get the list of all quests
        getQuests(env.apiLink,env.apiVersion).then((res) => {
            this.setState({
                quests : res
            })
        })

        // get the list of all stories
        getStories(env.apiLink,env.apiVersion).then((res) => {
            const s1 = res.sort(function(a, b){return a['order']-b['order']})
            const s2 = this.groupBy(s1, his => his.season)
            const data = [...s2]

            this.setState({
                stories : data
            })
        })

        // create obj contain list of each done quest by character
        this.getDone().then((res) => {
            this.setState({
                questsDone : res,
                loading : false
            })
        })
    }

    render() {

        const {loading, questsDone, characters, quests, stories} = this.state

        return (
            <div className="row">
                {loading &&
                <div className="progress">
                    <div className="indeterminate"> </div>
                </div>
                }
                {/*{characters &&*/}
                {/*<div className={"col s6"}>*/}
                {/*    <p>List of characters : </p>*/}
                {/*    <ul>*/}
                {/*        {characters.map((el) => (*/}
                {/*            <li key={el}>{el}</li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*</div>*/}
                {/*}*/}

                {(quests && characters && questsDone && stories) &&
                <div className="col s12">
                    <p>All Story Marked (green background)</p>

                        {
                            stories.map((storyTag) => (
                                storyTag[1].map((story) => (
                                    <div>
                                        <h5>{story['season']}</h5>
                                        <ul className="collapsible popout">
                                            <li key={story['id']}>
                                                <div className="collapsible-header">{story['name']} {story['races'] ? '- '+story['races'] : null }</div>

                                                <div className="collapsible-body">

                                                    <div className="grid">
                                                        {
                                                            quests.map((quest) => (

                                                                quest['story'] === story['id'] &&
                                                                <div key={quest['id']} className="card">
                                                                    <p className={'info'}><small>{story['timeline']}</small><small>Qid : {quest['id']}</small></p>
                                                                    <h5 className={'title'}>{quest['name']}</h5>
                                                                    <ul className={'browser-default'}>
                                                                        {characters.map((character) => (
                                                                            <li key={character} className={questsDone[character].includes(quest['id']) ? 'green' : ''}>{character}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ))

                            ))
                        }


                </div>
                }
            </div>
        )
    }

}

export default Stories