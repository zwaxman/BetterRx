import {combineReducers} from 'redux'
import {patient} from './patient'
import {patients} from './patients'
import {problem} from './problem'
import {problems} from './problems'

export const reducer = combineReducers({
  patient,
  patients,
  problem,
  problems,
})