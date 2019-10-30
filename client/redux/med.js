import axios from 'axios'
import {addMed, deleteMedFromMeds, editMedInMeds} from './meds'

const SET_MED = 'SET_MED'

export const setMed = med => ({
    type: SET_MED,
    med
})

export const createMed = (med, history) => async dispatch => {
    try {
        const {data} = await axios.post('/api/meds', med)
        dispatch(addMed(data))
        history.push(`/meds/${data.id}`)
    } catch (error) {
        console.log('Unable to create med')
    }
}

export const fetchMed = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/meds/${id}`)
        dispatch(setMed(data))
    } catch (error) {
        console.log('Unable to fetch med')
    }
}

export const deleteMed = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/meds/${id}`)
        dispatch(setMed({}))
        dispatch(deleteMedFromMeds(id))
        history.push("/meds")
    } catch (error) {
        console.log('Unable to delete med')
    }
}

export const editMed = (med, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/meds/${med.id}`, med)
        dispatch(setMed(data))
        dispatch(editMedInMeds(data))
        history.push(`/meds/${med.id}`)
    } catch (error) {
        console.log(error)
    }
}

export const sendAddMedClassToMed = (
    medId,
    medClassId
  ) => async dispatch => {
    try {
      const { data } = await axios.post(
        `/api/meds/${medId}/medClasses/${medClassId}`
      , {relLabel: 'BELONGS_TO_MED_CLASS', relProps: {}});
      dispatch(fetchMed(medId))
    } catch (error) {}
  };
  
  export const sendDeleteMedClassFromMed = (
    medId,
    medClassId
  ) => async dispatch => {
    try {
      await axios.delete(`/api/meds/${medId}/medClasses/${medClassId}`, {data: {relLabel: 'BELONGS_TO_MED_CLASS'}});
      dispatch(fetchMed(medId))
    } catch (error) {}
  };

export const med = (state = {}, action) => {
    switch (action.type) {
        case SET_MED:
            return action.med
        default:
            return state;
    }
}