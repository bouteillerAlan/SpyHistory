import React, {Component} from 'react'
import env from '../env'
import M from 'materialize-css'
import loadHash from 'lodash'

import getQuests from '../function/getQuests'
import getCharacters from '../function/getCharacters'
import getDoneQuests from '../function/getDoneQuests'
import getStories from '../function/getStories'
import getSeasons from '../function/getSeasons'

class Stories extends Component {

    constructor (props) {
        super(props)
        this.state = {
            key : this.props.apiKey,
            loading : true,
            data : false
        }
    }

    // init js
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
        const elems = document.querySelectorAll('.collapsible')
        const options = {}
        M.Collapsible.init(elems, options)
    }

    // build a object contain all infos
    async getter () {
        const seasonsNS = await getSeasons(env.apiLink,env.apiVersion)
        const storiesNS = await getStories(env.apiLink,env.apiVersion)
        const quests = await getQuests(env.apiLink,env.apiVersion)
        const characters = await getCharacters(env.apiLink,env.apiVersion,this.state.key)

        const seasons = seasonsNS.sort(function(a, b){return a['order']-b['order']})
        const stories = loadHash.orderBy(storiesNS, ['season', 'order'])

        let questsDone = {}
        for (let i = 0; i<characters.length; i++) {
            questsDone[characters[i]] = await getDoneQuests(env.apiLink,env.apiVersion,this.state.key,characters[i])
        }

        return {seasons, stories, quests, characters, questsDone}
    }

    componentWillMount () {
        this.getter().then((res) => {
            console.log(res)
            this.setState({
                loading : false,
                data : res
            })
        })
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
                                            <>
                                                {storieD['id'] === storieS ?
                                                    <li>
                                                        <div className="collapsible-header">
                                                            {storieD['name']} {storieD['races']?' - '+storieD['races']:null}
                                                        </div>
                                                        <div className="collapsible-body">
                                                            <ul className={'browser-default'}>
                                                                {data['quests'].map((quest) => (
                                                                    quest['story'] === storieD['id'] ?
                                                                        <div>
                                                                            <li>{quest['name']}
                                                                                <ul className={'browser-default'}>
                                                                                    {data.characters.map((character) => (
                                                                                        data.questsDone[character].map((questDone) => (
                                                                                            questDone === quest['id'] ?
                                                                                                <li>{character}</li>
                                                                                                : null
                                                                                        ))
                                                                                    ))}
                                                                                </ul>
                                                                            </li>
                                                                        </div>
                                                                        : null
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    : null}
                                            </>
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

export default Stories