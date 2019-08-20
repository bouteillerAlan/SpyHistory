import React, {Component} from 'react'
import env from '../env'
import M from 'materialize-css'
import Header from './Header'
import Account from './Account'
import History from './History'
import getAccount from '../function/getAccount'

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


    // init js
    componentDidMount () {
        const elems = document.querySelectorAll('select')
        const options = {}
        M.FormSelect.init(elems, options)
    }
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
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
            localKey : null
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

    render () {

        const {apiKeyError, localKey, lang, checkError} = this.state
        const error = apiKeyError ? 'invalid' : ''

        return (
            <section>

                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            {this.brand()}
                            <ul className="right">
                                <li>
                                    <a href="#reset" onClick={(e) => {this.handleReset(e)}}><i className="material-icons left">cached</i>Reset API key</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="container row">

                    {!localKey &&
                        <div>
                            <div className="col s12">
                                <blockquote>
                                    This app needs a API key to work (and others informations entered in the form below). It is stored in your browser via <a href={'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'} target="_blank" rel="noopener noreferrer">localStorage</a>. <br/>
                                    You can delete this cookie at any time via the button "Reset API key" present at the top right of your screen. <br/>
                                    No data is sent to our server. All data displayed in this application is provided by <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">Guild Wars 2 API</a> and localStorage cookie.
                                </blockquote>
                                <blockquote>
                                    You need to provide a key with the following informations : account, characters and progression. <br/>
                                    You can create a key from your <a href={'https://account.arena.net/applications'} target="_blank" rel="noopener noreferrer">ArenaNet account</a>.
                                </blockquote>
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
                                            <span className={checkError && 'error'}>I accept the registration of my API key and the choice of my display language in the "localStorage" cookie.</span>
                                        </label>
                                    </p>
                                </div>
                            </div>

                            <div className="col s12">
                                <blockquote>
                                    This app is made by <a href="https://alanbouteiller.dev" target="_blank" rel="noopener noreferrer">Alan Bouteiller</a>. <br/>
                                    The repo is available <a href="https://github.com/bouteillerAlan/SpyHistory" target="_blank" rel="noopener noreferrer">here</a>.
                                    Do not hesitate to create an <a href="https://github.com/bouteillerAlan/SpyHistory/issues" target="_blank" rel="noopener noreferrer">Issue</a> if you find a bug.<br/>
                                    All images are © 2019 ArenaNet, Inc..
                                </blockquote>
                            </div>
                        </div>


                    }

                    {localKey &&
                        <div>
                            <Account apiKey={localKey} lang={lang} />
                            <History apiKey={localKey} lang={lang} />
                        </div>
                    }
                </div>


            </section>
        )
    }
}

export default App
