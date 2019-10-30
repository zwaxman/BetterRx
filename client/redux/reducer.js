import {combineReducers} from 'redux'
import {patient} from './patient'
import {patients} from './patients'
import {problem} from './problem'
import {problems} from './problems'
import {medClass} from './medClass'
import {medClasses} from './medClasses'

export const reducer = combineReducers({
  patient,
  patients,
  problem,
  problems,
  medClass,
  medClasses
})