import axios from 'axios'
import {sort} from '../../util'

const SET_MEDS = 'SET_MEDS'
const ADD_MED = 'ADD_MED'
const DELETE_MED = 'DELETE_MED'
const EDIT_MED = 'EDIT_MED'

export const addMed = med => ({
    type: ADD_MED,
    med
})

export const setMeds = meds => ({
    type: SET_MEDS,
    meds
})

export const deleteMedFromMeds = id => ({
    type: DELETE_MED,
    id
})

export const editMedInMeds = med => ({
    type: EDIT_MED,
    med
})

export const fetchMeds = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/meds')
        dispatch(setMeds(data)) 
    } catch (error) {
        console.log('Unable to fetch meds')
    }
}

export const meds = (state = [], action) => {
    switch (action.type) {
        case SET_MEDS:
            return action.meds.sort(sort)
        case ADD_MED: 
            return [action.med, ...state].sort(sort)
        case DELETE_MED:
            return state.filter(med => med.id !== action.id)
        case EDIT_MED:
            return state.map(med => med.id === action.med.id ? action.med : med).sort(sort)
        default:
            return state;
    }
}