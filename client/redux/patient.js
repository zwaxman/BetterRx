import axios from "axios";
import {
  addPatient,
  deletePatientFromPatients,
  editPatientInPatients
} from "./patients";
import { sort } from "../../util";

const SET_PATIENT = "SET_PATIENT";
const ADD_PROP = "ADD_PROP"

export const setPatient = patient => ({
  type: SET_PATIENT,
  patient
});

export const addProp = (key, value) => ({
  type: ADD_PROP,
  key,
  value
})

export const addProblemToPatient = problem => ({
  type: ADD_PROBLEM_TO_PATIENT,
  problem
});

export const deleteProblemFromPatient = problemId => ({
  type: DELETE_PROBLEM_FROM_PATIENT,
  problemId
});

export const addAllergyToPatient = allergy => ({
  type: ADD_ALLERGY_TO_PATIENT,
  allergy
});

export const deleteAllergyFromPatient = allergyId => ({
  type: DELETE_ALLERGY_FROM_PATIENT,
  allergyId
});

export const createPatient = (patient, history) => async dispatch => {
  try {
    const { data } = await axios.post("/api/patients", patient);
    dispatch(addPatient(data));
    history.push(`/patients/${data.id}`);
  } catch (error) {
    console.log("Unable to create patient");
  }
};

export const fetchPatient = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/patients/${id}`);
    dispatch(setPatient(data));
  } catch (error) {
    console.log("Unable to fetch patient");
  }
};

export const fetchInteractions = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/patients/${id}/interactions`);
    console.log(data)
    dispatch(addProp('interactions',data));
  } catch (error) {
    console.log("Unable to fetch interactions");
  }
};

export const fetchOrphanMeds = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/patients/${id}/orphanMeds`);
    console.log(data)
    dispatch(addProp('orphanMeds',data));
  } catch (error) {
    console.log("Unable to fetch orphan medications");
  }
};

export const deletePatient = (id, history) => async dispatch => {
  try {
    await axios.delete(`/api/patients/${id}`);
    dispatch(setPatient({}));
    dispatch(deletePatientFromPatients(id));
    history.push("/patients");
  } catch (error) {
    console.log("Unable to delete patient");
  }
};

export const editPatient = (patient, history) => async dispatch => {
  try {
    const { data } = await axios.put(`/api/patients/${patient.id}`, patient);
    dispatch(setPatient(data));
    dispatch(editPatientInPatients(data));
    history.push(`/patients/${patient.id}`);
  } catch (error) {
    console.log("Unable to edit patient");
  }
};

export const sendAddProblemToPatient = (
  patientId,
  problemId
) => async dispatch => {
  try {
    const { data } = await axios.post(
      `/api/patients/${patientId}/problems/${problemId}`, {relLabel: 'HAS_PROBLEM', relProps: {}}
    );
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const sendDeleteProblemFromPatient = (
  patientId,
  problemId
) => async dispatch => {
  try {
    await axios.delete(`/api/patients/${patientId}/problems/${problemId}`, {data: {relLabel: 'HAS_PROBLEM'}});
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const sendAddAllergyToPatient = (
  patientId,
  allergyId
) => async dispatch => {
  try {
    const { data } = await axios.post(
      `/api/patients/${patientId}/medClasses/${allergyId}`, 
      {relLabel: 'ALLERGIC_TO_MED_CLASS', relProps: {}}
    );
    dispatch(fetchPatient(patientId))
  } catch (error) {
      console.log(error)
  }
};

export const sendDeleteAllergyFromPatient = (
  patientId,
  allergyId
) => async dispatch => {
  try {
    await axios.delete(`/api/patients/${patientId}/medClasses/${allergyId}`,
    {data: {relLabel: 'ALLERGIC_TO_MED_CLASS'}});
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const sendAddMedToPatient = (
  patientId,
  medId
) => async dispatch => {
  try {
    const { data } = await axios.post(
      `/api/patients/${patientId}/meds/${medId}`, 
      {relLabel: 'TAKES_MED', relProps: {}}
    );
    dispatch(fetchPatient(patientId))
  } catch (error) {
      console.log(error)
  }
};

export const sendDeleteMedFromPatient = (
  patientId,
  medId
) => async dispatch => {
  try {
    await axios.delete(`/api/patients/${patientId}/meds/${medId}`,
    {data: {relLabel: 'TAKES_MED'}});
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const patient = (state = {}, action) => {
  switch (action.type) {
    case SET_PATIENT:
      return Object.assign({}, state, action.patient);
      case ADD_PROP:
          return {...state, [action.key]: action.value};
    default:
      return state;
  }
};
