import React, {Component} from 'react'
import env from '../env'
import psl from '../quests_line'
import tuto from '../tuto_line'
import bk from '../backStories_line'
import M from 'materialize-css'
import loadHash from 'lodash'

import getQuests from '../function/getQuests'
import getCharacters from '../function/getCharacters'
import getDoneQuests from '../function/getDoneQuests'
import getBackstories from '../function/getBackstories'
import getStories from '../function/getStories'
import getSeasons from '../function/getSeasons'
import getInfoCharacter from '../function/getInfoCharacter'

import Guardian from '../style/img/Guardian_icon.png'
import Warrior from '../style/img/Warrior_icon.png'
import Necromancer from '../style/img/Necromancer_icon.png'
import Elementalist from '../style/img/Elementalist_icon.png'
import Thief from '../style/img/Thief_icon.png'
import Engineer from '../style/img/Engineer_icon.png'
import Ranger from '../style/img/Ranger_icon.png'
import Revenant from '../style/img/Revenant_icon.png'
import Mesmer from '../style/img/Mesmer_icon.png'

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
            elemShow : {},
            CarouselInit : false
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
        let backstories = {}
        let characterId = {}
        for (let i = 0; i<characters.length; i++) {
            questsDone[characters[i]] = await getDoneQuests(env.apiLink,env.apiVersion,this.state.lang,this.state.key,characters[i])
            backstories[characters[i]] = await getBackstories(env.apiLink,env.apiVersion,this.state.key,characters[i])
            characterId[characters[i]] = await getInfoCharacter(env.apiLink,env.apiVersion,this.state.lang,this.state.key,characters[i])
        }

        return {seasons, stories, quests, characters, questsDone, backstories, characterId}
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
        const elems_modal = document.querySelectorAll('.modal')
        const elems_carousel = document.querySelectorAll('.carousel')
        const options_collapsible = {}
        const options_tooltipped = {}
        const options_modal = {}
        const options_carousel = {fullWidth: true, indicators: true}
        M.Collapsible.init(elems_collapsible, options_collapsible)
        M.Tooltip.init(elems_tooltipped, options_tooltipped)
        M.Modal.init(elems_modal, options_modal)
        // Debug the indicator init
        if (!this.state.CarouselInit) {
            M.Carousel.init(elems_carousel, options_carousel)
            this.setState({
                CarouselInit : true
            })
        }
    }

    // map the data in a single iterative object
    map () {
        const {data} = this.state
        let obj = {}

        // seasons -> stories -> quests -> characters -> questsDone
        data['seasons'].map((season) => {

            // create object key
            obj[season['name']] = {id : season['id'], story : {}}

            data['stories'].map((story) => {

                // check if story is in seasons and store it
                if (story['season'] === season['id']) {

                    // if a race is set
                    const storyName = story['races'] ? story['name']+' - '+story['races'] : story['name']

                    obj[season['name']]['story'][storyName] = {id : story['id'], quests : {}, description : story['description']}

                    // and continue loop
                    data['quests'].map((quest) => {

                        // check if quest is in story and store it
                        if (quest['story'] === story['id']) {
                            obj[season['name']]['story'][storyName]['quests'][quest['id']] = {Qname :'', Qid:'', Qlevel:'', status:{}, authorization:{}}

                            data['characters'].map((character) => {

                                // stock name, id and level
                                obj[season['name']]['story'][storyName]['quests'][quest['id']]['Qname'] = quest['name']
                                obj[season['name']]['story'][storyName]['quests'][quest['id']]['Qid'] = quest['id']
                                obj[season['name']]['story'][storyName]['quests'][quest['id']]['Qlevel'] = quest['level']

                                // check if it's done, if it's the case tag it
                                obj[season['name']]['story'][storyName]['quests'][quest['id']]['status'][character] = data['questsDone'][character].includes(quest['id']) ? 1 : 0

                                // check if is authorized
                                // and stock it in obj[season['name']]['story'][storyName]['quests'][quest['id']]['authorization'][character]
                                // by default all quests is authorized
                                let a = true
                                data['backstories'][character]['backstory'].map((bkId) => {
                                    // if backstory exist in bk file
                                    if (bk[bkId]) {
                                        // if quest id exist in backstory bk file
                                        if (bk[bkId].includes(quest['id'])) {
                                            a = false
                                        }
                                    }

                                })
                                obj[season['name']]['story'][storyName]['quests'][quest['id']]['authorization'][character] = a

                            })
                        }
                    })
                }
            })
        })

        // return the map
        return obj
    }

    // works badly
    // only a part of the elements are deleted
    purge =()=> {
        const data = document.querySelectorAll('.material-tooltip')
        for (let i=0;i<data.length;i++) {
            data[i].remove()
        }
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
            this.purge()
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

    // return a block for each quests
    block =(map,id,season,story,lang)=> {
        const {data} = this.state

        return (
            <div className={'card_tree'} key={id}>
                <p className={'info'}>
                    <small>Lvl : {map[season]['story'][story]['quests'][id]['Qlevel']}</small>
                    {psl['durmand'].includes(id) ?
                        <span className="durmand tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Prieuré de Durmand' : 'Durmand Priory'}> </span>
                        : null
                    }
                    {psl['whisper'].includes(id) ?
                        <span className="whisper tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Ordre des Soupirs' : 'Order of Whispers'}> </span>
                        : null
                    }
                    {psl['vigil'].includes(id) ?
                        <span className="vigil tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Veilleurs' : 'Vigil'}> </span>
                        : null
                    }
                    <small>Qid : {map[season]['story'][story]['quests'][id]['Qid']}</small>
                </p>
                <h5 className={'title'}>{map[season]['story'][story]['quests'][id]['Qname']}</h5>
                <div className={'card_persona'}>
                    {Object.keys(map[season]['story'][story]['quests'][id]['status']).map((character) => (
                        <span key={character} className={'tooltipped status ' + (!map[season]['story'][story]['quests'][id]['authorization'][character] ? 'grey' : map[season]['story'][story]['quests'][id]['status'][character] ? 'green' : 'red')} data-position="top" data-tooltip={character}>
                            <span>
                                {!map[season]['story'][story]['quests'][id]['authorization'][character] ?
                                    <del>{character.substring(0,3)}</del>
                                    :
                                    character.substring(0,3)
                                }
                                {/*{data['characterId'][character]['profession']}*/}
                            </span>
                            <span>
                                <img src={
                                    data['characterId'][character]['profession'] === "Guardian" ? Guardian :
                                    data['characterId'][character]['profession'] === "Warrior" ? Warrior :
                                    data['characterId'][character]['profession'] === "Necromancer" ? Necromancer :
                                    data['characterId'][character]['profession'] === "Elementalist" ? Elementalist :
                                    data['characterId'][character]['profession'] === "Thief" ? Thief :
                                    data['characterId'][character]['profession'] === "Engineer" ? Engineer :
                                    data['characterId'][character]['profession'] === "Ranger" ? Ranger :
                                    data['characterId'][character]['profession'] === "Revenant" ? Revenant :
                                        data['characterId'][character]['profession'] === "Mesmer" ? Mesmer : null
                                } alt="class icon" className="icon_class"/>
                            </span>
                        </span>
                    ))}
                </div>

                {psl['2choice'].includes(id) ?
                    <div className="choice-2">
                        <i className="material-icons a">looks_two</i>
                        <hr/>
                    </div>
                    : null
                }
                {psl['3choice'].includes(id) ?
                    <div className="choice-3">
                        <i className="material-icons a">looks_3</i>
                        <hr/>
                    </div>
                    : null
                }
                {psl['5choice'].includes(id) ?
                    <div className="choice-5">
                        <i className="material-icons a">looks_5</i>
                        <hr/>
                    </div>
                    : null
                }
            </div>
        )
    }

    showCard =()=> {
        // get data
        const {data, elemShow, lang} = this.state
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
                            <div className="icons">
                                {/*History desc*/}
                                {map[season]['story'][story]['description'] &&
                                <p>
                                    <a className="modal-trigger" href={"#m"+id}>
                                        <i className="material-icons tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Description' : 'Description'}>announcement</i>
                                    </a>
                                </p>
                                }
                                {/*Tutorial*/}
                                {tuto[id]['link'] &&
                                <p>
                                    <a href={tuto[id]['link']} target="_blank" rel="noopener noreferrer" className="explore tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Vers le tutoriel' : 'Go to tutorial'}>
                                        <i className="material-icons">explore</i>
                                    </a>
                                </p>
                                }
                                {/*youtube*/}
                                {tuto[id]['video'] &&
                                <p>
                                    <a href={tuto[id]['video']} target="_blank" rel="noopener noreferrer" className="tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Vers la vidéo' : 'Go to the vidéo'}>
                                        <i className="material-icons">ondemand_video</i>
                                    </a>
                                </p>
                                }
                                {/*wiki*/}
                                {tuto[id]['wiki'] &&
                                <p>
                                    <a href={tuto[id]['wiki']} target="_blank" rel="noopener noreferrer" className="tooltipped" data-position="top" data-tooltip={lang==='fr' ? 'Vers le wiki' : 'Go to the wiki'}>
                                        <i className="material-icons">event_note</i>
                                    </a>
                                </p>
                                }
                            </div>
                        </div>
                        <div className="header-close animated">
                            <span onClick={() => {this.handleCard(map[season]['story'][story]['id'])}}>
                                <i className="material-icons">close</i>
                            </span>
                        </div>
                    </div>

                    <div className="schema animated">
                        <div className="ecran_overflow">
                            <div className="ecran">
                                {psl[map[season]['story'][story]['id']] && psl[map[season]['story'][story]['id']].map((quest) => (
                                    <div key={quest} className="grid">
                                        {quest.map((line) => (
                                            <div key={line} className="line">
                                                {line.map((id) => (
                                                    <div key={id} className="multi_card">
                                                        {Array.isArray(id) ?
                                                            // if id is array, is a choice
                                                            id.map((uId) => (
                                                                this.block(map,uId,season,story,lang)
                                                            ))
                                                            // else is a single quest
                                                            : this.block(map,id,season,story,lang)
                                                        }
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
        const {loading, data, lang} = this.state
        const map = data ? this.map() : null

        return (
            <div className="row">
                {loading &&
                    <div className="progress">
                        <div className="indeterminate"> </div>
                    </div>
                }

                {/*Modal generation*/}
                {map && Object.keys(map).map((season) => (
                    Object.keys(map[season]['story']).map((story) => (
                        <div key={map[season]['story'][story]['id']} id={'m'+map[season]['story'][story]['id']} className="modal">
                            <div className="modal-content">
                                <h4>Description</h4>
                                <p>{map[season]['story'][story]['description']}</p>
                            </div>
                        </div>
                    ))
                ))}

                {/*card stack generation*/}
                {map &&
                    <div id="season_grid">

                        <div className="carousel carousel-slider center">
                            {Object.keys(map).map((season) => (
                                <div key={season}>
                                {/*<div className="carousel-fixed-item center">*/}
                                {/*<a className="btn waves-effect white grey-text darken-text-2">button</a>*/}
                                {/*</div>*/}

                                <div className="carousel-item">
                                    <h4>
                                        {season + ' '}
                                        {tuto[map[season]['id']]['link'] &&
                                        <a href={tuto[map[season]['id']]['link']} target="_blank" rel="noopener noreferrer" className="explore tooltipped marging" data-position="right" data-tooltip={lang==='fr' ? 'Vers le tutoriel' : 'Go to tutorial'}>
                                            <i className="material-icons white-text">explore</i>
                                        </a>
                                        }
                                        {tuto[map[season]['id']]['wiki'] &&
                                        <a href={tuto[map[season]['id']]['wiki']} target="_blank" rel="noopener noreferrer" className="tooltipped" data-position="right" data-tooltip={lang==='fr' ? 'Vers le wiki' : 'Go to the wiki'}>
                                            <i className="material-icons white-text">event_note</i>
                                        </a>
                                        }
                                    </h4>
                                    <div>
                                        <div className="card_overflow">
                                            <div className="cards_stack">
                                                {Object.keys(map[season]['story']).map((story) => (
                                                    <div key={story} className={"card " + season.replace(/[\s]|[']/g,'')} onClick={(e) => {this.handleCard(map[season]['story'][story]['id'], season, story, e)}}>
                                                        <div className="card_bck">
                                                            <h6>{story}</h6>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>

                        <div className="icon_carousel">
                            <p onClick={() => {const inst = M.Carousel.getInstance(document.querySelector('.carousel')).prev()}}>
                                <i className="material-icons">arrow_back</i>
                            </p>
                            <p> </p>
                            <p onClick={() => {const inst = M.Carousel.getInstance(document.querySelector('.carousel')).next()}}>
                                <i className="material-icons">arrow_forward</i>
                            </p>
                        </div>

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