import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PatientComponents from './Patient'
const {AllPatients, SinglePatient, EditPatientForm} = PatientComponents
import AdminComponents from './Admin'
const {AllAdmins, SingleAdmin, EditAdminForm} = AdminComponents
import ProviderComponents from './Provider'
const {AllProviders, SingleProvider, EditProviderForm} = ProviderComponents
import ProblemComponents from './Problem'
const {NewProblemForm, AllProblems, SingleProblem, EditProblemForm} = ProblemComponents
import MedClassComponents from './MedClass'
const {NewMedClassForm, AllMedClasses, SingleMedClass, EditMedClassForm} = MedClassComponents
import MedComponents from './Med'
const {NewMedForm, AllMeds, SingleMed, EditMedForm} = MedComponents
import AuthComponents from './Auth'
const {Signup, Login} = AuthComponents
import {connect} from 'react-redux'
import {fetchPatients} from '../redux/patients'
import {fetchAdmins} from '../redux/admins'
import {fetchProviders} from '../redux/providers'
import {fetchProblems} from '../redux/problems'
import {fetchMedClasses} from '../redux/medClasses'
import {fetchMeds} from '../redux/meds'
import {getMe} from '../redux/user'
import Nav from './Nav'

class Main extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getMe()
        this.props.fetchProblems()
        this.props.fetchMedClasses()
        this.props.fetchMeds()
        this.props.fetchProviders()

        if (this.props.user.label==='provider') {
            this.props.fetchPatients()
        }
        if (this.props.user.label==='admin') {
            this.props.fetchAdmins()
        }
    }

    render() {
        return (
            <Router>
                <Nav />
                <Switch>
                <Route path='/patients/:id/edit' component={EditPatientForm} />
                <Route path='/patients/:id' component={SinglePatient} />
                <Route path='/patients' component={AllPatients} />
                <Route path='/admins/:id/edit' component={EditAdminForm} />
                <Route path='/admins/:id' component={SingleAdmin} />
                <Route path='/admins' component={AllAdmins} />
                <Route path='/providers/:id/edit' component={EditProviderForm} />
                <Route path='/providers/:id' component={SingleProvider} />
                <Route path='/providers' component={AllProviders} />
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
                <Route path='/auth/signup' component={Signup} />
                <Route path='/auth/login' component={Login} />
                </Switch>
            </Router>
        )

    }
} 

const mapStateToProps = ({user}) => ({user})
const mapDispatchToProps = {fetchPatients, fetchProblems, fetchMedClasses, fetchMeds, getMe, fetchProviders, fetchAdmins}
export default connect(mapStateToProps, mapDispatchToProps)(Main)