import {combineReducers} from 'redux'
import {patient} from './patient'
import {patients} from './patients'

export const reducer = combineReducers({
  patient,
  patients
})