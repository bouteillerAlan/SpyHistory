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
            apiKey: this.props.apiKey
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

        const {loading, account} = this.state

        return (
            <div className="row">
                {loading &&
                <div className="progress">
                    <div className="indeterminate"> </div>
                </div>
                }
                {account &&
                    <div>
                        <p>Welcome {account['name']} you have access to : </p>
                        <ul className="browser-default">
                            {account['access'].map(el => (
                                <li key={el}>{el}</li>
                            ))}
                        </ul>
                        <p><small>account id : {account['id']}</small></p>
                    </div>
                }
            </div>
        )
    }

}

export default Account