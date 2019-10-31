import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../redux/user'

const Nav = props => {
    return (
    <div>
        {props.user.label?<div>{`Logged in as ${props.user.label.toUpperCase()} #${props.user.id}`}</div>:null}
        {props.user.label?<div><Link to={`/${props.user.label}s/${props.user.id}`}>My Profile</Link></div>:null}
        {props.user.label==='provider' ? <div><Link to='/patients'>Patients</Link></div> : null}
        <div><Link to='/providers'>Providers</Link></div>
        {props.user.label==='admin' ? <div><Link to='/admins'>Admins</Link></div> : null}
        <div><Link to='/problems'>Problems</Link></div>
        <div><Link to='/medClasses'>Medication Classes</Link></div>
        <div><Link to='/meds'>Medications</Link></div>
        {!props.user.label?<div><Link to='/auth/login'>Login</Link></div>:null}
        {!props.user.label?<div><Link to='/auth/signup'>Signup</Link></div>:null}
        {props.user.label?<div><button type='button' onClick={()=>props.logout(props.history)}>Logout</button></div>:null}
        <br />
    </div>
    )
}

const mapStateToProps = ({user}) => ({user})
const mapDispatchToProps = {logout}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav))

