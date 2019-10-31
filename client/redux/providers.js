import axios from 'axios'
import {sort} from '../../util'

const SET_PROVIDERS = 'SET_PROVIDERS'
const DELETE_PROVIDER = 'DELETE_PROVIDER'
const EDIT_PROVIDER = 'EDIT_PROVIDER'

export const setProviders = providers => ({
    type: SET_PROVIDERS,
    providers
})

export const deleteProviderFromProviders = id => ({
    type: DELETE_PROVIDER,
    id
})

export const editProviderInProviders = provider => ({
    type: EDIT_PROVIDER,
    provider
})

export const fetchProviders = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/providers')
        dispatch(setProviders(data)) 
    } catch (error) {
        console.log('Unable to fetch providers')
    }
}

export const providers = (state = [], action) => {
    switch (action.type) {
        case SET_PROVIDERS:
            return action.providers.sort(sort)
        case DELETE_PROVIDER:
            return state.filter(provider => provider.id !== action.id)
        case EDIT_PROVIDER:
            return state.map(provider => provider.id === action.provider.id ? action.provider : provider).sort(sort)
        default:
            return state;
    }
}