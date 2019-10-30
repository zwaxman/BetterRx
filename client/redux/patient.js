import axios from 'axios'
import {addPatient, deletePatientFromPatients, editPatientInPatients} from './patients'
import {sort} from '../../util'

const SET_PATIENT = 'SET_PATIENT'
const ADD_PROBLEM_TO_PATIENT = 'ADD_PROBLEM_TO_PATIENT'
const DELETE_PROBLEM_FROM_PATIENT = 'DELETE_PROBLEM_FROM_PATIENT'

export const setPatient = patient => ({
    type: SET_PATIENT,
    patient
})

export const addProblemToPatient = problem => ({
    type: ADD_PROBLEM_TO_PATIENT,
    problem
})

export const deleteProblemFromPatient = problemId => ({
    type: DELETE_PROBLEM_FROM_PATIENT,
    problemId
})

export const createPatient = (patient, history) => async dispatch => {
    try {
        const {data} = await axios.post('/api/patients', patient)
        dispatch(addPatient(data))
        history.push(`/patients/${data.id}`)
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

export const deletePatient = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/patients/${id}`)
        dispatch(setPatient({}))
        dispatch(deletePatientFromPatients(id))
        history.push("/patients")
    } catch (error) {
        console.log('Unable to delete patient')
    }
}

export const editPatient = (patient, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/patients/${patient.id}`, patient)
        dispatch(setPatient(data))
        dispatch(editPatientInPatients(data))
        history.push(`/patients/${patient.id}`)
    } catch (error) {
        console.log('Unable to edit patient')
    }
}

export const sendAddProblemToPatient = (patientId, problemId) => async dispatch => {
    try {
        const {data} = await axios.post(`/api/patients/${patientId}/problems/${problemId}`)
        const {problem} = data
        dispatch(addProblemToPatient(problem))
    } catch (error) {
        
    }
}

export const sendDeleteProblemFromPatient = (patientId, problemId) => async dispatch => {
    try {
        await axios.delete(`/api/patients/${patientId}/problems/${problemId}`)
        dispatch(deleteProblemFromPatient(problemId))
    } catch (error) {
        
    }
}

export const patient = (state = {}, action) => {
    switch (action.type) {
        case SET_PATIENT:
            return action.patient
        case ADD_PROBLEM_TO_PATIENT:
            return {...state, problems: [...state.problems, action.problem].sort(sort)}
        case DELETE_PROBLEM_FROM_PATIENT:
            return {...state, problems: state.problems.filter(problem => problem.id !== action.problemId)}
        default:
            return state;
    }
}