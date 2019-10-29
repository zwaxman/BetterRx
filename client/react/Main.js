import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NewPatientForm from './NewPatientForm'
import AllPatients from './AllPatients'
import SinglePatient from './SinglePatient'

const Main = props => {
    return (
        <Router>
            <Switch>
            <Route path='/patients/new' component={NewPatientForm} />
            <Route path='/patients/:id' component={SinglePatient} />
            <Route path='/patients' component={AllPatients} />
            </Switch>
        </Router>
    )
}

export default Main