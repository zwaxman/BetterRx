import {combineReducers} from 'redux'
import {patient} from './patient'
import {patients} from './patients'
import {problem} from './problem'
import {problems} from './problems'
import {medClass} from './medClass'
import {medClasses} from './medClasses'
import {med} from './med'
import {meds} from './meds'
import {user} from './user'
import {admin} from './admin'
import {admins} from './admins'
import {provider} from './provider'
import {providers} from './providers'

export const reducer = combineReducers({
  patient,
  patients,
  problem,
  problems,
  medClass,
  medClasses,
  med,
  meds, user,
  admin,
  admins,
  provider,
  providers,
})