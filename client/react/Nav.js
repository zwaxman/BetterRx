import React from 'react'
import {Link} from 'react-router-dom'

export const Nav = props => {
    return (
    <div>
        <div><Link to='/patients'>Patients</Link></div>
        <div><Link to='/problems'>Problems</Link></div>
        <br />
    </div>
    )
}