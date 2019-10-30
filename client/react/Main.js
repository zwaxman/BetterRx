import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PatientComponents from './Patient'
const {NewPatientForm, AllPatients, SinglePatient, EditPatientForm} = PatientComponents
import ProblemComponents from './Problem'
const {NewProblemForm, AllProblems, SingleProblem, EditProblemForm} = ProblemComponents
import {connect} from 'react-redux'
import {fetchPatients} from '../redux/patients'
import {fetchProblems} from '../redux/problems'
import { Nav } from './Nav'

class Main extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchPatients()
        this.props.fetchProblems()
    }

    render() {
        return (
            <Router>
                <Nav />
                <Switch>
                <Route path='/patients/new' component={NewPatientForm} />
                <Route path='/patients/:id/edit' component={EditPatientForm} />
                <Route path='/patients/:id' component={SinglePatient} />
                <Route path='/patients' component={AllPatients} />
                <Route path='/problems/new' component={NewProblemForm} />
                <Route path='/problems/:id/edit' component={EditProblemForm} />
                <Route path='/problems/:id' component={SingleProblem} />
                <Route path='/problems' component={AllProblems} />
                </Switch>
            </Router>
        )

    }
} 

const mapDispatchToProps = {fetchPatients, fetchProblems}
export default connect(null, mapDispatchToProps)(Main)