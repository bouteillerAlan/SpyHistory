// Core
import React from 'react'
import ReactDOM from 'react-dom'
import {Route} from 'react-router'
import { Router } from 'react-router-dom'
import history from './history'

// Components
import App from './component/App'
// Fonts
import './style/font/font.scss'
// Styles
import './style/css/animated.scss'
import './style/css/materialize.scss'
import './style/css/base.scss'
import './style/css/shape.scss'
// Services
import * as serviceWorker from './serviceWorker'

function Routeur () {
    return (
        <div>
            <Router history={history}>
                {/*Site*/}
                <Route exact path='/observatory' component={App} />
            </Router>
        </div>
    )
}

ReactDOM.render(<Routeur />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
