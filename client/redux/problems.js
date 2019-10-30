import axios from 'axios'
import {sort} from '../../util'

const SET_PROBLEMS = 'SET_PROBLEMS'
const ADD_PROBLEM = 'ADD_PROBLEM'
const DELETE_PROBLEM = 'DELETE_PROBLEM'
const EDIT_PROBLEM = 'EDIT_PROBLEM'

export const addProblem = problem => ({
    type: ADD_PROBLEM,
    problem
})

export const setProblems = problems => ({
    type: SET_PROBLEMS,
    problems
})

export const deleteProblemFromProblems = id => ({
    type: DELETE_PROBLEM,
    id
})

export const editProblemInProblems = problem => ({
    type: EDIT_PROBLEM,
    problem
})

export const fetchProblems = () => async dispatch => {
    try {
        const {data} = await axios.get('/api/problems')
        dispatch(setProblems(data)) 
    } catch (error) {
        console.log('Unable to fetch problems')
    }
}

export const problems = (state = [], action) => {
    switch (action.type) {
        case SET_PROBLEMS:
            return action.problems.sort(sort)
        case ADD_PROBLEM: 
            return [action.problem, ...state].sort(sort)
        case DELETE_PROBLEM:
            return state.filter(problem => problem.id !== action.id)
        case EDIT_PROBLEM:
            return state.map(problem => problem.id === action.problem.id ? action.problem : problem).sort(sort)
        default:
            return state;
    }
}