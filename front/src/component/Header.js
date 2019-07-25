import React, {Component} from 'react'
import env from '../env'

class Header extends Component {

    constructor (props) {
        super(props)
        this.state = {
            online : false
        }
    }

    componentWillMount () {
        fetch(`${env.apiLink}${env.apiVersion}/build`, {
            method : 'GET',
            mode : 'cors'
        })
            .then(res => res.json())
            .then((res) => {
                this.setState({
                    online : true
                })
            })
    }

    render() {

        const {online} = this.state

        return (
            <div className="row header">
                <p>
                    {online && <span className='online'> <button className="btn-floating pulse"> </button> <span>Gw2 api is online</span></span>}
                    {!online && <span className='offline'> <button className="btn-floating pulse"> </button> <span>Gw2 api is offline</span></span>}
                </p>
            </div>
        )
    }

}

export default Header