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
            localKey : env.apiKey,
            lang : 'en'
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

    async handleSubmit () {
        const value = this.state.apiKey
        const lang = this.state.lang

        if (value === '') {
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

        const {apiKeyError, localKey, lang} = this.state
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
                    <div className="col s12 api-input">
                        <blockquote>
                            This app needs a API key to work. It is stored in your browser via <a href={'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'} target="_blank" rel="noopener noreferrer">localStorage</a>. <br/>
                            You can delete this cookie at any time via the button "Reset API key" present at the top right of your screen. <br/>
                            No data is sent to our server. All data displayed in this application is provided by <a href={'https://api.guildwars2.com/v2'} target="_blank" rel="noopener noreferrer">Guild Wars 2 API</a>
                        </blockquote>
                        <blockquote>
                            It will provide you with a key to read the following information: account, characters and progression. <br/>
                            You can create a key from your <a href={'https://account.arena.net/applications'} target="_blank" rel="noopener noreferrer">ArenaNet account</a>.
                        </blockquote>
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
