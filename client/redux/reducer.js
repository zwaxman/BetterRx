import {combineReducers} from 'redux'
import {patient} from './patient'
import {patients} from './patients'
import {problem} from './problem'
import {problems} from './problems'
import {medClass} from './medClass'
import {medClasses} from './medClasses'
import {med} from './med'
import {meds} from './meds'

export const reducer = combineReducers({
  patient,
  patients,
  problem,
  problems,
  medClass,
  medClasses,
  med,
  meds
})