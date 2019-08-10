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
            data : false,
            // modal is open ?
            isOpen : false,
            onClose : false,
            // stock the DOM coordinates of parent and grid for animation
            parent : {},
            grid : {},
            elemShow : {}
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

    // map the data in a single iterative object
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

                    obj[season['name']][storyName] = {id : story['id'], quests : {}, description : story['description']}

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

    setProperty () {
        const {parent,grid,onClose,elemShow} = this.state
        // just the body
        const body = document.getElementsByTagName('body')[0]
        // get the target content
        const target = document.getElementById(elemShow['id'])

        const header = target.getElementsByClassName('header')[0]
        const title = target.getElementsByClassName('header-title')[0]
        const btnClose = target.getElementsByClassName('header-close')[0]
        const schema = target.getElementsByClassName('schema')[0]
        const ecran_overflow = target.getElementsByClassName('ecran_overflow')[0]
        // set target value
        target.style.setProperty('--top-target', parent['top']+'px')
        target.style.setProperty('--left-target', parent['left']+'px')
        // transform origin is card emplacement - container value
        grid['elem'].style.transformOrigin = `${ parent['left']-grid['left'] }px ${ parent['top']-grid['top'] }px 0px`

        if (onClose) {
            // switch close status
            this.setState({
                onClose : false
            })
            // purge tooltip elem
            document.getElementsByClassName('tooltip-purge')
            // remove overflow
            ecran_overflow.style.overflow = 'hidden'
            target.style.overflow = 'hidden'
            // remove older animation
            title.classList.remove('fadeInLeft')
            btnClose.classList.remove('fadeInRight')
            header.classList.remove('fadeInDown')
            schema.classList.remove('fadeIn')
            // add new anim
            title.classList.add('fadeOutRight')
            btnClose.classList.add('fadeOutLeft')
            header.classList.add('fadeOutUp')
            schema.classList.add('fadeOut')
            // and just after close the card
            setTimeout(() => {
                title.style.opacity = '0'
                schema.style.opacity = '0'
                target.classList.add('exit') // add class for closing
                target.classList.remove('call') // remove class for opening
                grid['elem'].style.transform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)' // anim for background
            }, 350)
            // time exit animation - 5ms 250
            setTimeout(() => {
                // switch status card
                this.setState({
                    isOpen : false
                })
                target.style.display = 'none'
            }, 500) // delete card content to the view
        } else {
            // call target
            // show the overflow only at end
            target.style.overflow = 'hidden'
            ecran_overflow.style.overflow = 'hidden'
            // remove old class
            title.classList.remove('fadeOutRight')
            btnClose.classList.remove('fadeOutLeft')
            header.classList.remove('fadeOutUp')
            schema.classList.remove('fadeOut')
            // make sur content is invisible
            header.style.opacity = '0'
            schema.style.opacity = '0'
            grid['elem'].style.transform = 'matrix3d(5,0,0.00,0,0.00,5,0.00,0,0,0,1,0,0,0,0,1)' // anim the background
            target.classList.remove('exit') // remove class for closing
            target.style.display = 'block' // show card content
            target.classList.add('call') // add class for opening
            // add animated and make elem visible
            setTimeout(() => {
                ecran_overflow.style.overflow = 'auto'
                header.classList.add('fadeInDown')
                header.style.opacity = '1'
            }, 350)
            setTimeout(() => {
                title.classList.add('fadeInLeft')
                btnClose.classList.add('fadeInRight')
                schema.style.opacity = '1'
                schema.classList.add('fadeIn')
            }, 360)
        }

        // toggle overflow for the body
        body.classList.toggle('noOver')
    }

    handleCard (id, season, story, e) {
        const {isOpen} = this.state
        // if is not open stock the value of grid, target and data
        // the value is delete and replace each time of card is open
        if (!isOpen) {
            // card is open
            this.setState({
                isOpen : true
            })
            this.setState({
                grid : {
                    elem : document.getElementById('season_grid'),
                    top : document.getElementById('season_grid').getBoundingClientRect().top,
                    left : document.getElementById('season_grid').getBoundingClientRect().left
                },
                parent : {
                    elem : e.currentTarget,
                    top : e.currentTarget.getBoundingClientRect().top,
                    left : e.currentTarget.getBoundingClientRect().left
                },
                elemShow : {
                    season : season,
                    story : story,
                    id : id,
                }
            }, () => {
                // function work but just code no...
                this.showCard()
                this.setProperty()
            })
        } else {
            // if is a close action value is already defined
            // onClose demand
            this.setState({
                onClose : true
            }, () => {
                this.showCard()
                this.setProperty()
            })
        }
    }

    showCard () {
        // get data
        const {data, elemShow} = this.state
        const map = data ? this.map() : null
        // stock
        const season = elemShow['season']
        const story = elemShow['story']
        const id = elemShow['id']

        // return card with good data
        return (
            <div className="card_content" id={id}>
                <div className="content">
                    <div className={"header animated " + season.replace(/[\s]|[']/g,'')}>
                        <div className="header-title animated">
                            <h4>{season}</h4>
                            <p>{story}</p>
                        </div>
                        <div className="header-close animated">
                            <span onClick={() => {this.handleCard(map[season][story]['id'])}}>
                                <i className="material-icons">close</i>
                            </span>
                        </div>
                    </div>
                    {/*<div className="description">*/}
                    {/*    <div>*/}
                    {/*        <h5>Description</h5>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <p>{map[season][story]['description']}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="schema animated">
                        <div className="ecran_overflow">
                            <div className="ecran">
                                {psl[story.split('- ')[1]] && psl[story.split('- ')[1]].map((quest) => (
                                    <div key={quest} className="grid">
                                        {quest.map((line) => (
                                            <div key={line} className="line">
                                                {line.map((id) => (
                                                    <div key={id} className="multi_card">
                                                        {Array.isArray(id) ?
                                                            // if is a array is a choice
                                                            id.map((uId) => (
                                                                <div key={uId} className={'card_tree'}>
                                                                    <p className={'info'}><small>Lvl : {map[season][story]['quests'][uId]['Qlevel']}</small><small>Qid : {map[season][story]['quests'][uId]['Qid']}</small></p>
                                                                    <h5 className={'title'}>{map[season][story]['quests'][uId]['Qname']}</h5>
                                                                    <div className={'card_persona'}>
                                                                        {Object.keys(map[season][story]['quests'][uId]['status']).map((character) => (
                                                                            <span key={character} className={'tooltipped status ' + (map[season][story]['quests'][uId]['status'][character] ? 'green' : 'red')} data-position="top" data-tooltip={character}>
                                                                                <span>
                                                                                    {character.substring(0,3)}
                                                                                </span>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))
                                                            // else is a single quest
                                                            :
                                                            <div className={'card_tree'}>
                                                                <p className={'info'}><small>Lvl : {map[season][story]['quests'][id]['Qlevel']}</small><small>Qid : {map[season][story]['quests'][id]['Qid']}</small></p>
                                                                <h5 className={'title'}>{map[season][story]['quests'][id]['Qname']}</h5>
                                                                <div className={'card_persona'}>
                                                                    {Object.keys(map[season][story]['quests'][id]['status']).map((character) => (
                                                                        <span key={character} className={'tooltipped status ' + (map[season][story]['quests'][id]['status'][character] ? 'green' : 'red')} data-position="top" data-tooltip={character}>
                                                                                <span>
                                                                                    {character.substring(0,3)}
                                                                                </span>
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
                    </div>
                </div>
            </div>
        )

    }

    render() {
        const {loading, data} = this.state
        const map = data ? this.map() : null

        return (
            <div className="row">
                {loading &&
                    <div className="progress">
                        <div className="indeterminate"> </div>
                    </div>
                }

                {/*card stack generation*/}
                {map &&
                    <div id="season_grid">
                        {Object.keys(map).map((season) => (
                            <div key={season}>
                                <h4><blockquote>{season}</blockquote></h4>

                                <div>
                                    <div className="cards_stack">
                                        {Object.keys(map[season]).map((story) => (
                                            <div key={story} className={"card " + season.replace(/[\s]|[']/g,'')} onClick={(e) => {this.handleCard(map[season][story]['id'], season, story, e)}}>
                                                <div className="card_bck">
                                                    <h6>{story}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                }

                {this.state.isOpen &&
                    this.showCard()
                }

            </div>
        )
    }

}

export default History