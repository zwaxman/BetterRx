import axios from 'axios'
import {deleteAdminFromAdmins, editAdminInAdmins} from './admins'

const SET_ADMIN = 'SET_ADMIN'

export const setAdmin = admin => ({
    type: SET_ADMIN,
    admin
})

export const fetchAdmin = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/admins/${id}`)
        dispatch(setAdmin(data))
    } catch (error) {
        console.log('Unable to fetch admin')
    }
}

export const deleteAdmin = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/admins/${id}`)
        dispatch(setAdmin({}))
        dispatch(deleteAdminFromAdmins(id))
        history.push("/admins")
    } catch (error) {
        console.log('Unable to delete admin')
    }
}

export const editAdmin = (admin, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/admins/${admin.id}`, admin)
        dispatch(setAdmin(data))
        dispatch(editAdminInAdmins(data))
        history.push(`/admins/${admin.id}`)
    } catch (error) {
        console.log(error)
    }
}

export const admin = (state = {}, action) => {
    switch (action.type) {
        case SET_ADMIN:
            return action.admin
        default:
            return state;
    }
}