import React, {Component} from 'react'
import env from '../env'
import M from 'materialize-css'
import Header from './Header'
import Account from './Account'
import History from './History'
import getAccount from '../function/getAccount'
import ShapeOverlays from '../function/ShapeOverlay'
import logoBus from '../style/img/logo.png'
import card from '../style/img/card.png'
import flag_fr from '../style/img/france.png'
import flag_uk from '../style/img/united-kingdom.png'

class App extends Component {

    constructor () {
        super()
        this.state = {
            apiKey : '',
            apiKeyError : null,
            checkError : null,
            localKey : env.apiKey,
            lang : 'en',
            check : false
        }
    }

    setEvent () {
        const elmHamburger = document.querySelector('.hamburger')
        const gNavItems = document.querySelectorAll('.global-menu__item')
        const elmOverlay = document.querySelector('.shape-overlays')
        const overlay = new ShapeOverlays(elmOverlay)

        elmHamburger.addEventListener('click', () => {
            if (overlay.isAnimating) {
                return false
            }
            overlay.toggle()
            if (overlay.isOpened === true) {
                for (let i = 0; i < gNavItems.length; i++) {
                    gNavItems[i].classList.add('is-opened')
                }
            } else {
                for (let i = 0; i < gNavItems.length; i++) {
                    gNavItems[i].classList.remove('is-opened')
                }
            }
        })
    }

    // init js
    componentDidMount () {
        const elems = document.querySelectorAll('select')
        const options = {}
        M.FormSelect.init(elems, options)
    }
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
        // trigger only if a button exist
        if (this.state.localKey) {
            this.setEvent()
        }
        const elems = document.querySelectorAll('select')
        const options = {}
        M.FormSelect.init(elems, options)
    }

    handleForm =(e)=> {
        const value = e.target.value
        this.setState({apiKey : value})
        if (value === '') {
            this.setState({apiKeyError : 'Value must not be null'})
        } else if (value.match(/[[\]\\&~@^%!:*$€¤£µ_*/+°={}`|#²<>]/gm)) {
            this.setState({apiKeyError : 'Unauthorized character'})
        } else if (!value.match(/[A-Z0-9]{8}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{20}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{12}/gm)) {
            this.setState({apiKeyError : 'Value is not a api key format'})
        } else {
            this.setState({apiKeyError : false})
        }
    }

    handleCheck =(e)=> {
        const value = document.getElementById('check').checked
        if (value) {
            this.setState({
                check : value,
                checkError : null
            })
        } else {
            this.setState({
                check : false,
                checkError : 'Accept conditions'
            })
        }
    }

    async handleSubmit () {
        const value = this.state.apiKey
        const lang = this.state.lang
        const check = this.state.check

        if (!check) {
            this.setState({checkError : 'Accept conditions'})
        } else if (value === '') {
            this.setState({apiKeyError : 'Value must not be null'})
        } else if (value.match(/[[\]\\&~@^%!:*$€¤£µ_*/+°={}`|#²<>]/gm)) {
            this.setState({apiKeyError : 'Unauthorized character'})
        } else if (!value.match(/[A-Z0-9]{8}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{20}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{12}/gm)) {
            this.setState({apiKeyError : 'Value is not a api key format'})
        } else {
            getAccount(env.apiLink,env.apiVersion,value).then((res) => {
                // if key doesnt exist
                if(res['text'] === 'Invalid access token') {
                    this.setState({
                        apiKeyError : 'Invalid key'
                    })
                } else {
                    localStorage.setItem('apiKey', value)
                    localStorage.setItem('lang', lang)
                    this.setState({
                        apiKeyError : false,
                        localKey : value,
                        lang : lang
                    })

                    const gNavItems = document.querySelectorAll('.global-menu__item')
                    const elmOverlay = document.querySelector('.shape-overlays')
                    const overlay = new ShapeOverlays(elmOverlay)
                    if (overlay.isAnimating) {
                        return false
                    }
                    overlay.toggle()
                    if (overlay.isOpened === true) {
                        for (let i = 0; i < gNavItems.length; i++) {
                            gNavItems[i].classList.add('is-opened')
                        }
                    } else {
                        for (let i = 0; i < gNavItems.length; i++) {
                            gNavItems[i].classList.remove('is-opened')
                        }
                    }
                }
            })
        }
    }

    async handleReset (e) {
        e.preventDefault()
        localStorage.removeItem('apiKey')
        localStorage.removeItem('lang')
        this.setState({
            apiKey : '',
            localKey : null,
            check : false
        })
    }

    handleSelect (e) {
        this.setState({lang: e.target.value})
    }

    brand =()=> {
        return (
            <>
                {/*Web*/}
                <span className="brand-logo hide-on-small-only show-on-medium-and-up large">
                    <span className={'text-brand'}>
                        Observatory
                        <span>Keep your story in mind</span>
                    </span>
                    {/*api status*/}
                    <Header/>
                </span>

                {/*Mobile*/}
                <span className="brand-logo show-on-small hide-on-med-and-up">
                    <span className={'text-brand small'}>
                        Obs.
                    </span>
                </span>
            </>
        )
    }

    nav =()=> {
        return (
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper">
                        {this.brand()}
                        <ul className="right">
                            <li>
                                <a href="#reset" className="hamburger" onClick={(e) => {this.handleReset(e)}}>
                                    <i className="material-icons right rotate">cached</i>
                                    Reset
                                </a>
                            </li>
                            <li>
                                <a href="https://www.lebusmagique.fr/"><i className="material-icons">arrow_forward</i></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }

    getTop =(lang)=> {
        this.setState({lang:lang})
    }

    render () {
        const {apiKeyError, localKey, lang, checkError} = this.state
        const error = apiKeyError ? 'invalid' : ''

        return (
            <section>

                {localKey &&
                    this.nav()
                }

                <div className="demo-3">

                    {!localKey &&
                        <div>

                            {/*head*/}
                            <div className="head full row col s12 valign-wrapper center-align">

                                <div className="meteor ma"> </div>
                                <div className="meteor mb"> </div>
                                <div className="meteor mc"> </div>
                                <div className="meteor md"> </div>
                                <div className="meteor me"> </div>
                                <div className="meteor mf"> </div>

                                <div className="row title">
                                    <h1><span className="yellow-text">O</span>bservatory</h1>
                                    <h2>Keep your story in mind</h2>
                                </div>

                                <div className="row lig_yellow"> </div>

                                <div className="flag">
                                    <p>
                                        <span>
                                            <a href="#top">
                                                <img className="flag_img" src={flag_fr} alt="flag fr" onClick={() => {this.getTop('fr')}}/>
                                            </a>
                                        </span>
                                        <span>
                                            <a href="#top">
                                                <img className="flag_img" src={flag_uk} alt="flag uk" onClick={() => {this.getTop('en')}}/>
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {/*end head*/}

                            <div className="row container valign-wrapper content" id="top">
                                <div className="row">
                                    <div className="col s12 m6 img_content">
                                        <img src={logoBus} alt="logo du busmagique"/>
                                    </div>
                                    <div className="col s12 m6">
                                        {lang === 'en' ?
                                            <div>
                                                <h3>What is Observatory</h3>
                                                <p>Hosted by <a href="https://www.lebusmagique.fr/" target="_blank" rel="noopener noreferrer">Le Bus Magique</a>, Observatory lets you know where each of your characters is in the Guild Wars 2 quest timeline.</p>
                                            </div>
                                            :
                                            <div>
                                                <h3>C'est quoi Observatory</h3>
                                                <p>Hébergé par <a href="https://www.lebusmagique.fr/" target="_blank" rel="noopener noreferrer">Le Bus Magique</a>, Observatory permet de savoir ou en est chacun de vos personnages dans la chronologie des quêtes de Guild Wars 2.</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="row container valign-wrapper content">
                                <div className="row">
                                    <div className="col s12 m6">
                                        {lang === 'en' ?
                                            <div>
                                                <h3>How it works</h3>
                                                <p>Thanks to the <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">API provided by ArenaNet</a> we have sorted Seasons, Stories and Quests in a chronological order as a card deck.</p>
                                                <p>In each card the quest tree follows the chronological order and provides multiple information about the possible choices of each character.</p>
                                            </div>
                                            :
                                            <div>
                                                <h3>Comment ça fonctionne</h3>
                                                <p>Grâce à <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">l'api fourni par ArenaNet</a> nous avons trié par ordre chronologique les Saisons, Histoires et Quêtes sous forme de deck de carte.</p>
                                                <p>Dans chaque carte l'arborescence des quêtes suit l'ordre chronologique et fourni de multiples informations sur les choix possibles ou non de chaque personnage.</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="col s12 m6 img_content">
                                        <img src={card} alt="card"/>
                                    </div>
                                </div>
                            </div>

                            <div className="row container valign-wrapper content">
                                <div>
                                    <div className="col s12">
                                        {lang === 'en' ?
                                            <>
                                                <div className="col s12 m6">
                                                    <h3>Data storage</h3>
                                                    <p>This app needs a API key to work (and others informations entered in the form below). It is stored in your browser via <a href={'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'} target="_blank" rel="noopener noreferrer">localStorage</a>.</p>
                                                    <p>You can delete this cookie at any time via the button "Reset" present at the top right of your screen. </p>
                                                    <p>No data is sent to our server. All data displayed in this application is provided by <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">Guild Wars 2 API</a> and localStorage cookie.</p>
                                                </div>
                                                <div className="col s12 m6">
                                                    <h3>Information to provide</h3>
                                                    <p>You need to provide a key with the following informations : account, characters, progression and pvp.</p>
                                                    <p>You can create a key from your <a href={'https://account.arena.net/applications'} target="_blank" rel="noopener noreferrer">ArenaNet account</a>.</p>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="col s12 m6">
                                                    <h3>Stockage des données</h3>
                                                    <p>Cette application à besoin d'une clés API pour fonctionner (ainsi que des informations entrée dans le formulaire ci-dessous). Ces informations sont stocké dans votre navigateur via <a href={'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'} target="_blank" rel="noopener noreferrer">localStorage</a>.</p>
                                                    <p>Vous pouvez supprimer ce cookie n'importe quand via le bouton "Reset" présent en haut à droite de votre écran.</p>
                                                    <p>Aucune donnée est envoyé à notre serveur. Toute les donées affichée sont fournis par <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">l'api Guild Wars 2</a> et le cookie localStorage.</p>
                                                </div>
                                                <div className="col s12 m6">
                                                    <h3>Informations à fournir</h3>
                                                    <p>Il faut fournir une clés api avec les informations suivante : account, characters, progression et pvp.</p>
                                                    <p>Vous pouvez crée une clés api depuis votre <a href={'https://account.arena.net/applications'} target="_blank" rel="noopener noreferrer">compte ArenaNet</a>.</p>
                                                </div>
                                            </>
                                        }
                                    </div>

                                    <div className="col s12 api-input">
                                        <div className="input-field col s12 l6">
                                            <input id="apiKey" type="text" className={error} value={this.state.apiKey} onChange={(e) => {this.handleForm(e)}}/>
                                            <label htmlFor="apiKey">api key</label>
                                            {apiKeyError && <span className="helper-text">{apiKeyError}</span>}
                                        </div>
                                        <div className="input-field col s12 l6">
                                            <select value={lang} onChange={(e) => {this.handleSelect(e)}}>
                                                <option value="en">English</option>
                                                <option value="fr">Français</option>
                                            </select>
                                            <label>Language</label>
                                        </div>
                                        <div className="col s12 l12">
                                            <button className="btn waves-effect waves-light" onClick={() => {this.handleSubmit()}}>Submit
                                                <i className="material-icons right">send</i>
                                            </button>
                                            <p>
                                                <label>
                                                    <input type="checkbox" id="check" onChange={(e) => {this.handleCheck(e)}}/>
                                                    <span className={checkError && 'error'}>{lang === 'en' ? "I accept the registration of my API key and the choice of my display language in the \"localStorage\" cookie." : "J'accepte l'enregistrement de ma clés api et du choix de ma langue d'affichage dans le cookie localStorage"}</span>
                                                </label>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col s12">
                                        {lang === 'en' ?
                                            <div className="col s12">
                                                <p>
                                                    This app is made by <a href="https://alanbouteiller.dev" target="_blank" rel="noopener noreferrer">Alan Bouteiller</a> for <a href="https://www.lebusmagique.fr/" target="_blank" rel="noopener noreferrer">Le Bus Magique</a>.
                                                    Do not hesitate to create an <a href="https://github.com/bouteillerAlan/SpyHistory/issues" target="_blank" rel="noopener noreferrer">Issue</a> if you find a bug.
                                                    All game images are © 2019 ArenaNet, Inc..<br/>
                                                    <small>CC BY-NC-SA Alan Bouteiller</small>
                                                </p>
                                            </div>
                                            :
                                            <div className="col s12">
                                                <p>
                                                    Cette application à été codé par <a href="https://alanbouteiller.dev" target="_blank" rel="noopener noreferrer">Alan Bouteiller</a> pour <a href="https://www.lebusmagique.fr/" target="_blank" rel="noopener noreferrer">Le Bus Magique</a>.
                                                    N'hésité pas à crée une <a href="https://github.com/bouteillerAlan/SpyHistory/issues" target="_blank" rel="noopener noreferrer">Issue</a> si vous trouvez un bug.
                                                    Toutes les images du jeu sont © 2019 ArenaNet, Inc..<br/>
                                                    <small>CC BY-NC-SA Alan Bouteiller</small>
                                                </p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {localKey &&
                    <div className="global-menu container">
                        <Account apiKey={localKey} lang={lang} />
                        <History apiKey={localKey} lang={lang} />
                    </div>
                    }

                    <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path className="shape-overlays__path"> </path>
                        <path className="shape-overlays__path"> </path>
                        <path className="shape-overlays__path"> </path>
                    </svg>
                </div>

            </section>
        )
    }
}

export default App
