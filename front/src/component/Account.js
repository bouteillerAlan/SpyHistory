import React, {Component} from 'react'
import env from '../env'
import getAccount from '../function/getAccount'

class Account extends Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            account: null,
            apiKey : localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : this.props.apiKey,
            lang : localStorage.getItem('lang') ? localStorage.getItem('lang') : this.props.lang
        }
    }

    componentWillMount() {
        getAccount(env.apiLink,env.apiVersion,this.state.apiKey).then((res) => {
            this.setState({
                loading : false,
                account : res
            })
        })
    }

    render() {

        const {loading, account, lang} = this.state
        let tab = []

        if (account) {
            account['access'].map((el) => {
                if (el === 'GuildWars2') {
                    tab.push('Guild Wars 2')
                } else if (el === 'HeartOfThorns') {
                    tab.push('Heart Of Thorns')
                } else if (el === 'PathOfFire') {
                    tab.push('Path Of Fire')
                } else {
                    tab.push(el)
                }
            })
        }

        return (
            <div className="row">
                {loading &&
                <div className="progress">
                    <div className="indeterminate"> </div>
                </div>
                }
                {account &&
                <div className={'row col s12'}>

                    <div className="col s12 m6">
                        <h4>{lang === 'en' ? 'Welcome ' : 'Bonjour '}{account['name']}</h4>
                        <h5>{lang === 'en' ? 'You have access to :' : 'Vous avez accès à :'}</h5>
                        <ul>
                            {tab.map(el => (
                                <li key={el}>{el}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="col s12 m6">
                        <h4>{lang === 'en' ? 'Legend' : 'Légende' }</h4>

                        <table className="legend">
                            <tr>
                                <td className="center-align"><span className="grey"><del>Name</del></span></td>
                                <td>{lang === 'en' ? ' Locked quest after a choice in the story' : ' Quête verrouillé suite à un choix dans l\'histoire' }</td>
                            </tr>
                            <tr>
                                <td className="center-align"><span className="red">Name</span></td>
                                <td>{lang === 'en' ? ' Quest not realized' : ' Quête non réalisée' }</td>
                            </tr>
                            <tr>
                                <td className="center-align"><span className="green">Name</span></td>
                                <td>{lang === 'en' ? ' Quest realized' : ' Quête réalisée' }</td>
                            </tr>
                            <tr>
                                <td className="center-align"><span> <i className="material-icons">looks_two</i> </span></td>
                                <td>{lang === 'en' ? ' After this quests it will be necessary to choose among the 2 quests which is below' : ' Aprés cette quêtes il faudra choisir parmis les 2 quêtes qui se trouve dessous' }</td>
                            </tr>
                            <tr>
                                <td className="center-align"><div className="durmand"> </div></td>
                                <td><p>{lang === 'en' ? ' Quests only available for this faction' : ' Quêtes accessibles uniquement pour cette faction' }</p></td>
                            </tr>
                        </table>
                    </div>

                </div>
                }
            </div>
        )
    }

}

export default Account