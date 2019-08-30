import React, {Component} from 'react'
import env from '../env'
import getAccount from '../function/getAccount'
import getPvp from '../function/getPvp'
import M from 'materialize-css'

class Account extends Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            account: null,
            pvp: null,
            apiKey : localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : this.props.apiKey,
            lang : localStorage.getItem('lang') ? localStorage.getItem('lang') : this.props.lang,
            apiKeyError: null
        }
    }

    componentWillMount() {
        getAccount(env.apiLink,env.apiVersion,this.state.apiKey).then((res) => {
            if (res['text'] || res['text'] === 'Invalid access token') {
                this.setState({
                    apiKeyError : 'Invalid key',
                    loading: false
                })
            } else {
                this.setState({
                    account : res
                })
                getPvp(env.apiLink,env.apiVersion,this.state.apiKey).then((res) => {
                    this.setState({
                        loading : false,
                        pvp : res
                    })
                })
            }
        })
    }

    // init js
    // DidUpdate because the elem is not render if fetch is null
    componentDidUpdate () {
        const elems_modal = document.querySelectorAll('.modal')
        const options_modal = {}
        M.Modal.init(elems_modal, options_modal)
    }

    render() {

        const {loading, account, lang, pvp, apiKeyError} = this.state
        let tab = []

        if (account) {
            account['access'].includes('GuildWars2') ? tab.push({'name':'Guild Wars 2','status':true}) : tab.push({'name':'Guild Wars 2','status':false})
            account['access'].includes('HeartOfThorns') ? tab.push({'name':'Heart Of Thorns','status':true}) : tab.push({'name':'Heart Of Thorns','status':false})
            account['access'].includes('PathOfFire') ? tab.push({'name':'Path Of Fire','status':true}) : tab.push({'name':'Path Of Fire','status':false})
        }

        return (
            <div className="row">
                {(!loading && apiKeyError) &&
                <div>
                    <div className="red-text">{lang==='fr' ? 'Une erreur c\'est produite, vérifiez votre clé api. \n Cliquez sur le bouton reset pour revenir a la page d\'avant.' : 'An error occurred, check your API key. \n Click on the reset button to return to the previous page.'}</div>
                </div>
                }
                {loading &&
                <div className="progress">
                    <div className="indeterminate"> </div>
                </div>
                }
                {(account && pvp) &&
                <div className={'row col s12'}>

                    <div className="col s12">

                        <div className="card id col s12">

                            <div className="card-content white-text">
                                <h5 className="card-title">{account['name']}</h5>
                                <h6>{lang === 'en' ? 'Your access' : 'Vos accès'}</h6>
                                <div className="access">
                                    {tab.map(el => (
                                        <div key={el['name']} className={"badge-access " + (el['status'] ? "green" : "red")}>{el['name']}</div>
                                    ))}
                                </div>
                                <h6>{lang === 'en' ? 'Level' : 'Niveaux'}</h6>
                                <div className="level">
                                    <p className="valign-wrapper">
                                        <span className="wvw tooltipped" data-position="top" data-tooltip={lang === 'en' ? 'WvW' : 'McM'}> </span>
                                        <span>{account['wvw_rank']}</span>
                                    </p>
                                    <p className="valign-wrapper">
                                        <span className="pvp tooltipped" data-position="top" data-tooltip={lang === 'en' ? 'PvP' : 'JcJ'}> </span>
                                        <span>{pvp['pvp_rank']}</span>
                                    </p>
                                    <p className="valign-wrapper">
                                        <span className="fractal tooltipped" data-position="top" data-tooltip={"Fractal"}> </span>
                                        <span>{account['fractal_level']}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card-action">
                                <button data-target="modal1" className="btn modal-trigger">{lang === 'en' ? 'Legend' : 'Légende' }</button>
                                <button data-target="modal2" className="btn modal-trigger">{lang === 'en' ? 'Warning' : 'Important' }</button>
                            </div>

                        </div>

                    </div>

                    {/*Modal Structure*/}
                    <div id="modal1" className="modal">
                        <div className="modal-content">
                            <h4 className="modal-title">{lang === 'en' ? 'Legend' : 'Légende' }</h4>
                            <table className="legend">
                                <tbody>
                                <tr>
                                    <td className="center-align"><span className="grey"><del>Name</del></span></td>
                                    <td>{lang === 'en' ? ' Quest locked after a choice when creating the character' : ' Quête verrouillée suite à un choix lors de la création du personnage' }</td>
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
                                    <td>{lang === 'en' ? ' After this quests it will be necessary to choose among the 2 quests which is below' : ' Après cette quête il faudra choisir parmi les 2 quêtes qui se trouve dessous' }</td>
                                </tr>
                                <tr>
                                    <td className="center-align"><div className="durmand"> </div></td>
                                    <td><p>{lang === 'en' ? ' Quests only available for this faction' : ' Quêtes accessibles uniquement pour cette faction' }</p></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="modal2" className="modal">
                        <div className="modal-content">
                            <h4 className="modal-title">{lang === 'en' ? 'Warning' : 'Important' }</h4>
                            <p>{lang === 'en' ? ' Completed but restarted quests are considered unrealized!' : ' Le système de fonctionnement de l\'API détermine qu\'un épisode d\'histoire relancé est par définition non terminé. Ce qui explique que certains épisodes soient considérés par cette dernière comme non fait alors qu\'ils ont certainement été relancés mais terminés par le passé.' }</p>
                        </div>
                    </div>

                </div>
                }
            </div>
        )
    }

}

export default Account