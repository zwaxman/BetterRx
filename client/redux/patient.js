import axios from "axios";
import {
  addPatient,
  deletePatientFromPatients,
  editPatientInPatients
} from "./patients";
import { sort } from "../../util";

const SET_PATIENT = "SET_PATIENT";

export const setPatient = patient => ({
  type: SET_PATIENT,
  patient
});

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
      `/api/patients/${patientId}/problems/${problemId}`
    );
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const sendDeleteProblemFromPatient = (
  patientId,
  problemId
) => async dispatch => {
  try {
    await axios.delete(`/api/patients/${patientId}/problems/${problemId}`);
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const sendAddAllergyToPatient = (
  patientId,
  allergyId
) => async dispatch => {
  try {
    const { data } = await axios.post(
      `/api/patients/${patientId}/medClasses/${allergyId}`
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
    await axios.delete(`/api/patients/${patientId}/medClasses/${allergyId}`);
    dispatch(fetchPatient(patientId))
  } catch (error) {}
};

export const patient = (state = {}, action) => {
  switch (action.type) {
    case SET_PATIENT:
      return action.patient;
    default:
      return state;
  }
};
