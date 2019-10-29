import axios from 'axios'
import {addPatient} from './patients'

const SET_PATIENT = 'SET_PATIENT'

export const setPatient = patient => ({
    type: SET_PATIENT,
    patient
})

export const createPatient = patient => async dispatch => {
    try {
        const {data} = await axios.post('/api/patients', patient)
        dispatch(setPatient(data))
        dispatch(addPatient(data))
    } catch (error) {
        console.log('Unable to create patient')
    }
}

export const fetchPatient = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/patients/${id}`)
        dispatch(setPatient(data))
    } catch (error) {
        console.log('Unable to fetch patient')
    }
}

export const patient = (state = {}, action) => {
    switch (action.type) {
        case SET_PATIENT:
            return action.patient
        default:
            return state;
    }
}