import axios from 'axios'
import {addProblem, deleteProblemFromProblems, editProblemInProblems} from './problems'

const SET_PROBLEM = 'SET_PROBLEM'

export const setProblem = problem => ({
    type: SET_PROBLEM,
    problem
})

export const createProblem = (problem, history) => async dispatch => {
    try {
        const {data} = await axios.post('/api/problems', problem)
        dispatch(addProblem(data))
        history.push(`/problems/${data.id}`)
    } catch (error) {
        console.log('Unable to create problem')
    }
}

export const fetchProblem = id => async dispatch => {
    try {
        const {data} = await axios.get(`/api/problems/${id}`)
        dispatch(setProblem(data))
    } catch (error) {
        console.log('Unable to fetch problem')
    }
}

export const deleteProblem = (id, history) => async dispatch => {
    try {
        await axios.delete(`/api/problems/${id}`)
        dispatch(setProblem({}))
        dispatch(deleteProblemFromProblems(id))
        history.push("/problems")
    } catch (error) {
        console.log('Unable to delete problem')
    }
}

export const editProblem = (problem, history) => async dispatch => {
    try {
        const {data} = await axios.put(`/api/problems/${problem.id}`, problem)
        dispatch(setProblem(data))
        dispatch(editProblemInProblems(data))
        history.push(`/problems/${problem.id}`)
    } catch (error) {
        console.log(error)
    }
}

export const sendAddTxClassToProblem = (
    problemId,
    txClassId
  ) => async dispatch => {
    try {
      const { data } = await axios.post(
        `/api/problems/${problemId}/medClasses/${txClassId}`
      );
      dispatch(fetchProblem(problemId))
    } catch (error) {}
  };
  
  export const sendDeleteTxClassFromProblem = (
    problemId,
    txClassId
  ) => async dispatch => {
    try {
      await axios.delete(`/api/problems/${problemId}/medClasses/${txClassId}`);
      dispatch(fetchProblem(problemId))
    } catch (error) {}
  };

export const problem = (state = {}, action) => {
    switch (action.type) {
        case SET_PROBLEM:
            return action.problem
        default:
            return state;
    }
}