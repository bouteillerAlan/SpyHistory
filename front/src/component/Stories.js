import React, {Component} from 'react'
import env from '../env'
import getStories from '../function/getStories'

class Stories extends Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            error: false,
            stories: ''
        }
    }

    componentWillMount() {
        getStories(env.apiLink,env.apiVersion).then((res) => {
            this.setState({
                loading : false,
                stories : res
            })
        })
    }

    render() {

        const {loading, stories} = this.state

        return (
            <div className="container row">
                {loading && <h3>LOADING</h3>}
                {stories !== '' &&
                <div className={'grid col s12'}>
                    {stories.map(el => (
                        <div key={el['id']} className="col s12 m6">
                            <div className={'card'}>
                                <p className={'info'}><small>{el['timeline']}</small><small>{el['races']}</small></p>
                                <h5 className={'title'}><small>({el['id']})</small> {el['name']}</h5>
                                <p>Chapters : </p>
                                <ul>
                                    {el['chapters'].map(el => (
                                        <li key={el['name']}>{el['name']}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                }
            </div>
        )
    }

}

export default Stories