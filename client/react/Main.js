import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PatientComponents from './Patient'
const {NewPatientForm, AllPatients, SinglePatient, EditPatientForm} = PatientComponents
import ProblemComponents from './Problem'
const {NewProblemForm, AllProblems, SingleProblem, EditProblemForm} = ProblemComponents
import MedClassComponents from './MedClass'
const {NewMedClassForm, AllMedClasses, SingleMedClass, EditMedClassForm} = MedClassComponents
import MedComponents from './Med'
const {NewMedForm, AllMeds, SingleMed, EditMedForm} = MedComponents
import {connect} from 'react-redux'
import {fetchPatients} from '../redux/patients'
import {fetchProblems} from '../redux/problems'
import {fetchMedClasses} from '../redux/medClasses'
import {fetchMeds} from '../redux/meds'
import { Nav } from './Nav'

class Main extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.fetchPatients()
        this.props.fetchProblems()
        this.props.fetchMedClasses()
        this.props.fetchMeds()
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
                <Route path='/medClasses/new' component={NewMedClassForm} />
                <Route path='/medClasses/:id/edit' component={EditMedClassForm} />
                <Route path='/medClasses/:id' component={SingleMedClass} />
                <Route path='/medClasses' component={AllMedClasses} />
                <Route path='/meds/new' component={NewMedForm} />
                <Route path='/meds/:id/edit' component={EditMedForm} />
                <Route path='/meds/:id' component={SingleMed} />
                <Route path='/meds' component={AllMeds} />
                </Switch>
            </Router>
        )

    }
} 

const mapDispatchToProps = {fetchPatients, fetchProblems, fetchMedClasses, fetchMeds}
export default connect(null, mapDispatchToProps)(Main)