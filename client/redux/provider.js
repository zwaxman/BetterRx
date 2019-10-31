import axios from 'axios'
import {deleteProviderFromProviders, editProviderInProviders} from './providers'

const SET_PROVIDER = 'SET_PROVIDER'

export const setProvider = provider => ({
    type: SET_PROVIDER,
    provider
})

export const fetchProvider = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/providers/${id}`)
        dispatch(setProvider(data))
    } catch (error) {
        console.log('Unable to fetch provider')
    }
}

export const deleteProvider = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/providers/${id}`)
        dispatch(setProvider({}))
        dispatch(deleteProviderFromProviders(id))
        history.push("/providers")
    } catch (error) {
        console.log('Unable to delete provider')
    }
}

export const editProvider = (provider, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/providers/${provider.id}`, provider)
        dispatch(setProvider(data))
        dispatch(editProviderInProviders(data))
        history.push(`/providers/${provider.id}`)
    } catch (error) {
        console.log(error)
    }
}

export const provider = (state = {}, action) => {
    switch (action.type) {
        case SET_PROVIDER:
            return action.provider
        default:
            return state;
    }
}