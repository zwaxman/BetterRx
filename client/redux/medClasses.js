import axios from 'axios'
import {sort} from '../../util'

const SET_MED_CLASSES = 'SET_MED_CLASSES'
const ADD_MED_CLASS = 'ADD_MED_CLASS'
const DELETE_MED_CLASS = 'DELETE_MED_CLASS'
const EDIT_MED_CLASS = 'EDIT_MED_CLASS'

export const addMedClass = medClass => ({
    type: ADD_MED_CLASS,
    medClass
})

export const setMedClasses = medClasses => ({
    type: SET_MED_CLASSES,
    medClasses
})

export const deleteMedClassFromMedClasses = id => ({
    type: DELETE_MED_CLASS,
    id
})

export const editMedClassInMedClasses = medClass => ({
    type: EDIT_MED_CLASS,
    medClass
})

export const fetchMedClasses = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/medClasses')
        dispatch(setMedClasses(data)) 
    } catch (error) {
        console.log('Unable to fetch medClasses')
    }
}

export const medClasses = (state = [], action) => {
    switch (action.type) {
        case SET_MED_CLASSES:
            return action.medClasses.sort(sort)
        case ADD_MED_CLASS: 
            return [action.medClass, ...state].sort(sort)
        case DELETE_MED_CLASS:
            return state.filter(medClass => medClass.id !== action.id)
        case EDIT_MED_CLASS:
            return state.map(medClass => medClass.id === action.medClass.id ? action.medClass : medClass).sort(sort)
        default:
            return state;
    }
}