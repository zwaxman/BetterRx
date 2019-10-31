import axios from "axios";
import {fetchPatients, clearPatients} from "./patients"
import {clearPatient} from "./patient"
import {fetchAdmins} from "./admins"

const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER"

export const setUser = user => ({
    type: SET_USER,
    user
  });

  export const logoutUser = () => ({
      type: LOGOUT_USER
  })

  export const signup = (body, history) => async dispatch => {
    try {
      const { data } = await axios.post("/api/auth/signup", body);
      dispatch(setUser(data));
      history.push(`/${data.label}s/${data.id}`)
    } catch (error) {
      console.log("Unable to signup");
    }
  };

  export const login = (body, history) => async dispatch => {
    try {
      const { data } = await axios.put("/api/auth/login", body);
      dispatch(setUser(data));
      if (data.label==='provider') {
          dispatch(fetchPatients())
      } else if (data.label==='admin') {
        dispatch(fetchAdmins())
      }
      history.push(`/${data.label}s/${data.id}`)
    } catch (error) {
      console.log("Unable to login");
    }
  };

  export const getMe = () => async dispatch => {
    try {
        const { data } = await axios.get("/api/auth/me");
        dispatch(setUser(data));
        if (data.label==='provider') {
            dispatch(fetchPatients())
        }
      } catch (error) {
        console.log("Unable to restore session");
      }
  }

  export const logout = history => async dispatch => {
    try {
      await axios.delete("/api/auth/logout");
      dispatch(logoutUser());
      dispatch(clearPatient())
      dispatch(clearPatients())
      history.push('/auth/login')
    } catch (error) {
      console.log("Unable to logout");
    }
  };

export const user = (state = {}, action) => {
    switch (action.type) {
      case SET_USER:
        return action.user;
    case LOGOUT_USER:
        return {}
      default:
        return state;
    }
  };
  