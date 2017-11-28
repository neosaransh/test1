import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import PasswordReset from './PasswordReset'
import Profile from './Profile'
import NotFound from './NotFound'
import ClientList from './ClientList'
import Screens from './Screens'
import Patient from './Patient'
import Contact from './Contact'
import NewPatient from './NewPatient'
import Goals from './Goals'

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Login}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/signup' component={SignUp}/>
                    <Route path='/passwordreset' component={PasswordReset}/>
                    <Route path='/profile' component={Profile}/>
                    <Route path='/patient' component={Patient}/>
                    <Route path='/clientlist' component={ClientList}/>
                    <Route path='/contact' component={Contact}/>
                    <Route path='/screens' component={Screens}/>
                    <Route path='/newpatient' component={NewPatient}/>
                    <Route path='/goals' component={Goals}/>
                    <Route component={NotFound}/>
                </Switch>
            </main>
        );
    }
}

export default Main;
