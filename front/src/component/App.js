import React, {Component} from 'react'
import env from '../env'
import Header from './Header'
import Account from './Account'
import History from './History'

class App extends Component {

    constructor () {
        super()
        this.state = {
            apiKey : '',
            apiKeyError : null,
            localKey : env.apiKey
        }
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

        if (value === '') {
            this.setState({apiKeyError : 'Value must not be null'})
        } else if (value.match(/[[\]\\&~@^%!:*$€¤£µ_*/+°={}`|#²<>]/gm)) {
            this.setState({apiKeyError : 'Unauthorized character'})
        } else if (!value.match(/[A-Z0-9]{8}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{20}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{4}[-]{1}[A-Z0-9]{12}/gm)) {
            this.setState({apiKeyError : 'Value is not a api key format'})
        } else {
            localStorage.setItem('apiKey', value)
            this.setState({
                apiKeyError : false,
                localKey : value
            })
        }
    }

    async handleReset (e) {
        e.preventDefault()
        localStorage.removeItem('apiKey')
        this.setState({
            apiKey : '',
            localKey : null
        })
    }

    render () {

        const {apiKeyError, localKey} = this.state
        const error = apiKeyError ? 'invalid' : ''

        return (
            <section>

                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper">
                            <span className="brand-logo">Spy your history <Header/></span>
                            <ul className="right hide-on-med-and-down">
                                <li>
                                    <a href="#reset" onClick={(e) => {this.handleReset(e)}}><i className="material-icons left">cached</i>Reset API key</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                <div className="container row">

                    {!localKey &&
                    <div className="col s12">
                        <div className="input-field col s12 l12">
                            <input id="apiKey" type="text" className={error} value={this.state.apiKey} onChange={(e) => {this.handleForm(e)}}/>
                            <label htmlFor="apiKey">api key</label>
                            {apiKeyError && <span className="helper-text">{apiKeyError}</span>}
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
                            <Account apiKey={localKey} />
                            <History apiKey={localKey} />
                        </div>
                    }
                </div>


            </section>
        )
    }
}

export default App
