import React, {Component} from 'react'
import env from '../env'
import getAccount from '../function/getAccount'

class testingAPI extends Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            account: ''
        }
    }

    componentWillMount() {
        getAccount(env.apiLink,env.apiVersion,env.apiKey).then((res) => {
            console.log(res)
            this.setState({
                loading : false,
                account : res
            })
        })

    }

    render() {

        const {loading, account} = this.state

        return (
            <div>
                {loading && <h3>LOADING</h3>}
                {account !== '' &&
                    <div>
                        <p>Welcome {account['name']} you have an access to : </p>
                        <ul>

                            {account['access'].map(el => (
                                    <li key={el}>{el}</li>
                            ))}

                        </ul>
                    </div>
                }
            </div>

        )
    }

}

export default testingAPI