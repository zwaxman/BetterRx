import axios from 'axios'
import {sort} from '../../util'

const SET_PATIENTS = 'SET_PATIENTS'
const ADD_PATIENT = 'ADD_PATIENT'
const DELETE_PATIENT = 'DELETE_PATIENT'
const EDIT_PATIENT = 'EDIT_PATIENT'

export const addPatient = patient => ({
    type: ADD_PATIENT,
    patient
})

export const setPatients = patients => ({
    type: SET_PATIENTS,
    patients
})

export const deletePatientFromPatients = id => ({
    type: DELETE_PATIENT,
    id
})

export const editPatientInPatients = patient => ({
    type: EDIT_PATIENT,
    patient
})

export const fetchPatients = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/patients')
        dispatch(setPatients(data)) 
    } catch (error) {
        console.log('Unable to fetch patients')
    }
}

export const patients = (state = [], action) => {
    switch (action.type) {
        case SET_PATIENTS:
            return action.patients.sort(sort)
        case ADD_PATIENT: 
            return [action.patient, ...state].sort(sort)
        case DELETE_PATIENT:
            return state.filter(patient => patient.id !== action.id)
        case EDIT_PATIENT:
            return state.map(patient => patient.id === action.patient.id ? action.patient : patient).sort(sort)
        default:
            return state;
    }
}