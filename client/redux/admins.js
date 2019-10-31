import axios from 'axios'
import {sort} from '../../util'

const SET_ADMINS = 'SET_ADMINS'
const DELETE_ADMIN = 'DELETE_ADMIN'
const EDIT_ADMIN = 'EDIT_ADMIN'

export const setAdmins = admins => ({
    type: SET_ADMINS,
    admins
})

export const deleteAdminFromAdmins = id => ({
    type: DELETE_ADMIN,
    id
})

export const editAdminInAdmins = admin => ({
    type: EDIT_ADMIN,
    admin
})

export const fetchAdmins = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/admins')
        dispatch(setAdmins(data)) 
    } catch (error) {
        console.log('Unable to fetch admins')
    }
}

export const admins = (state = [], action) => {
    switch (action.type) {
        case SET_ADMINS:
            return action.admins.sort(sort)
        case DELETE_ADMIN:
            return state.filter(admin => admin.id !== action.id)
        case EDIT_ADMIN:
            return state.map(admin => admin.id === action.admin.id ? action.admin : admin).sort(sort)
        default:
            return state;
    }
}