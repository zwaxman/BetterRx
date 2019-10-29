import axios from 'axios'

const SET_PATIENTS = 'SET_PATIENTS'
const ADD_PATIENT = 'ADD_PATIENT'

export const addPatient = patient => ({
    type: ADD_PATIENT,
    patient
})

export const setPatients = patients => ({
    type: SET_PATIENTS,
    patients
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
            return action.patients
        case ADD_PATIENT: 
            return [action.patient, ...state]
        default:
            return state;
    }
}