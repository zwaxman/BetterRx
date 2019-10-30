import axios from 'axios'
import {addMedClass, deleteMedClassFromMedClasses, editMedClassInMedClasses} from './medClasses'

const SET_MED_CLASS = 'SET_MED_CLASS'

export const setMedClass = medClass => ({
    type: SET_MED_CLASS,
    medClass
})

export const createMedClass = (medClass, history) => async dispatch => {
    try {
        const {data} = await axios.post('/api/medClasses', medClass)
        dispatch(addMedClass(data))
        history.push(`/medClasses/${data.id}`)
    } catch (error) {
        console.log('Unable to create medClass')
    }
}

export const fetchMedClass = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/medClasses/${id}`)
        dispatch(setMedClass(data))
    } catch (error) {
        console.log('Unable to fetch medClass')
    }
}

export const deleteMedClass = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/medClasses/${id}`)
        dispatch(setMedClass({}))
        dispatch(deleteMedClassFromMedClasses(id))
        history.push("/medClasses")
    } catch (error) {
        console.log('Unable to delete medClass')
    }
}

export const editMedClass = (medClass, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/medClasses/${medClass.id}`, medClass)
        dispatch(setMedClass(data))
        dispatch(editMedClassInMedClasses(data))
        history.push(`/medClasses/${medClass.id}`)
    } catch (error) {
        console.log(error)
    }
}

export const medClass = (state = {}, action) => {
    switch (action.type) {
        case SET_MED_CLASS:
            return action.medClass
        default:
            return state;
    }
}