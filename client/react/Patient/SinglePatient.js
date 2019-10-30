import React from "react";
import { connect } from "react-redux";
import {
  fetchPatient,
  deletePatient,
  sendAddProblemToPatient,
  sendDeleteProblemFromPatient
} from "../../redux/patient";
import { Link } from "react-router-dom";

class SinglePatient extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showProblemForm: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPatient(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deletePatient(
        Number(this.props.match.params.id),
        this.props.history
      );
    } else if (e.target.id === "showProblemForm") {
      this.setState(state => ({
        ...state,
        showProblemForm: !state.showProblemForm
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.id === "addProblem") {
      this.props.sendAddProblemToPatient(
        this.props.match.params.id,
        e.target.problem.value
      );
    }
  }

  render() {
    const { id, name, age, sex, ethnicity } = this.props.patient;
    const patientProblems = this.props.patient.problems || [];
    const patientProblemsIds =
      patientProblems.length > 0
        ? patientProblems.map(problem => problem.id)
        : [];
    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h2>MRN: {id}</h2>
          <button type="button" id="delete" onClick={this.handleClick}>
            Delete Patient
          </button>
        </div>

        <div id="demographics">
          <h2>Demographics</h2>
          <h4>Age: {age}</h4>
          <h4>Sex: {sex}</h4>
          <h4>Ethnicity: {ethnicity}</h4>
          <Link to={`/patients/${id}/edit`}>
            <button type="button">Edit Demographics</button>
          </Link>
        </div>

        <h2>Allergies</h2>

        <div>
          <h2>Problem List</h2>

          {patientProblems.map(problem => (
            <div key={problem.id}>
              {/* In the future will add a warning icon if the problem is not being treated with any medication */}
              <Link to={`/problems/${problem.id}`} >
                {problem.name}
              </Link>
              <button type='button' onClick={()=>this.props.sendDeleteProblemFromPatient(id, problem.id)}>Delete</button>
            </div>
          ))}

          <button type="button" id="showProblemForm" onClick={this.handleClick}>
            {this.state.showProblemForm ? "Hide" : "Add Problem"}
          </button>

          {this.state.showProblemForm ? (
            <form id="addProblem" onSubmit={this.handleSubmit}>
              <select name="problem">
                {this.props.problems
                  .filter(problem => !patientProblemsIds.includes(problem.id))
                  .map(problem => (
                    <option key={problem.id} value={problem.id}>
                      {problem.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about diagnosis date, diagnosis criteria, disease status */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <h2>Medications</h2>
        <h2>Insurance</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ patient, problems }) => ({ patient, problems });
const mapDispatchToProps = {
  fetchPatient,
  deletePatient,
  sendAddProblemToPatient,
  sendDeleteProblemFromPatient
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SinglePatient);
