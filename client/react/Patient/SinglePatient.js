import React from "react";
import { connect } from "react-redux";
import {
  fetchPatient,
  deletePatient,
  sendAddProblemToPatient,
  sendDeleteProblemFromPatient,
  sendAddAllergyToPatient,
  sendDeleteAllergyFromPatient,
  sendAddMedToPatient,
  sendDeleteMedFromPatient,
  fetchInteractions,
  fetchOrphanMeds,
  fetchOrphanProblems
} from "../../redux/patient";
import { Link } from "react-router-dom";
import { sort } from "../../../util";

class SinglePatient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProblemForm: false,
      showAllergyForm: false,
      showMedForm: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (
      this.props.user.label &&
      (this.props.user.label === "provider" ||
        (this.props.user.label === "patient" &&
          this.props.user.id == Number(this.props.match.params.id)))
    ) {
      this.props.fetchPatient(this.props.match.params.id);
      this.props.fetchInteractions(this.props.match.params.id);
      this.props.fetchOrphanMeds(this.props.match.params.id);
      this.props.fetchOrphanProblems(this.props.match.params.id);
    }
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
    } else if (e.target.id === "showAllergyForm") {
      this.setState(state => ({
        ...state,
        showAllergyForm: !state.showAllergyForm
      }));
    } else if (e.target.id === "showMedForm") {
      this.setState(state => ({
        ...state,
        showMedForm: !state.showMedForm
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
    } else if (e.target.id === "addAllergy") {
      this.props.sendAddAllergyToPatient(
        this.props.match.params.id,
        e.target.allergy.value
      );
    } else if (e.target.id === "addMed") {
      this.props.sendAddMedToPatient(
        this.props.match.params.id,
        e.target.med.value
      );
    }
  }

  render() {
    console.log("rendering");
    if (!this.props.user) {
      return "Denied: Must be logged in";
    }

    if (
      this.props.user.label === "patient" &&
      this.props.user.id !== Number(this.props.match.params.id)
    ) {
      return "Denied: This is not your chart";
    }

    if (this.props.user.label === "admin") {
      return "Denied: Administrators cannot see patient information";
    }

    const { id, name, age, sex, ethnicity } = this.props.patient;
    const { label } = this.props.user;

    const patientProblems = this.props.patient.problems || [];
    const patientProblemsIds =
      patientProblems.length > 0
        ? patientProblems.map(problem => problem.id)
        : [];

    const allergies = this.props.patient.allergies || [];
    const allergiesIds =
      allergies.length > 0 ? allergies.map(allergy => allergy.id) : [];

    const meds = this.props.patient.meds || [];
    const medsIds = meds.length > 0 ? meds.map(allergy => allergy.id) : [];

    const allergyAlerts = this.props.patient.allergyAlerts || [];
    const allergyAlertsIds =
      allergyAlerts.length > 0
        ? allergyAlerts.map(allergyAlert => allergyAlert.id)
        : [];

    const interactions = this.props.patient.interactions || [];
    const interactionsIds =
      interactions.length > 0
        ? interactions.map(interaction => interaction.med.id)
        : [];

    const orphanMeds = this.props.patient.orphanMeds || [];
    const orphanMedsIds =
      orphanMeds.length > 0 ? orphanMeds.map(orphanMed => orphanMed.id) : [];

    const orphanProblems = this.props.patient.orphanProblems || [];
    const orphanProblemsIds =
      orphanProblems.length > 0
        ? orphanProblems.map(orphanProblem => orphanProblem.id)
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

        <div>
          <h2>Allergies</h2>

          {allergies.sort(sort).map(allergy => (
            <div key={allergy.id}>
              {/* In the future will add a warning icon if patient receiving any medication with an allergy */}
              <Link to={`/medClasses/${allergy.id}`}>{allergy.name}</Link>

              {label === "provider" ? (
                <button
                  type="button"
                  onClick={() =>
                    this.props.sendDeleteAllergyFromPatient(id, allergy.id)
                  }
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}

          {label === "provider" ? (
            <button
              type="button"
              id="showAllergyForm"
              onClick={this.handleClick}
            >
              {this.state.showAllergyForm ? "Hide" : "Add Allergy"}
            </button>
          ) : null}

          {label === "provider" && this.state.showAllergyForm ? (
            <form id="addAllergy" onSubmit={this.handleSubmit}>
              <select name="allergy">
                {this.props.medClasses
                  .filter(medClass => !allergiesIds.includes(medClass.id))
                  .map(medClass => (
                    <option key={medClass.id} value={medClass.id}>
                      {medClass.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about allergy severity, symptoms, specific drugs in class */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <div>
          <h2>Problem List</h2>

          {patientProblems.sort(sort).map(problem => (
            <div key={problem.id}>
              {orphanProblemsIds.includes(problem.id) ? (
                <div className="tooltip">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="tooltiptext allergy">
                    Warning: None of patient's medications address this problem
                  </span>
                </div>
              ) : null}
              <Link to={`/problems/${problem.id}`}>{problem.name}</Link>

              {label === "provider" ? (
                <button
                  type="button"
                  onClick={() =>
                    this.props.sendDeleteProblemFromPatient(id, problem.id)
                  }
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}

          {label === "provider" ? (
            <button
              type="button"
              id="showProblemForm"
              onClick={this.handleClick}
            >
              {this.state.showProblemForm ? "Hide" : "Add Problem"}
            </button>
          ) : null}

          {label === "provider" && this.state.showProblemForm ? (
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

        <div>
          <h2>Medications</h2>

          {meds.sort(sort).map(med => (
            <div key={med.id}>
              {/* In the future will add a warning icon if the med is not treating any problem on problem list */}

              {orphanMedsIds.includes(med.id) ? (
                <div className="tooltip">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="tooltiptext allergy">
                    Warning: Medication not treating any problem in problem list
                  </span>
                </div>
              ) : null}

              {allergyAlertsIds.includes(med.id) ? (
                <div className="tooltip">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="tooltiptext allergy">
                    Warning: Possible allergic reaction
                  </span>
                </div>
              ) : null}

              {interactionsIds.includes(med.id) ? (
                <div className="tooltip">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="tooltiptext interaction">
                    {interactions
                      .filter(interaction => {
                        return interaction.med.id === med.id;
                      })
                      .map(interaction => {
                        const warning = `Warning: ${interaction.med.name} (class: ${interaction.medClass.name}) interacts with ${interaction.interactionMed.name} (class: ${interaction.interactionMedClass.name})`;
                        return (
                          <div key={interaction.interactionMed.id}>
                            {warning}
                          </div>
                        );
                      })}
                  </span>
                </div>
              ) : null}

              <Link to={`/meds/${med.id}`}>{med.name}</Link>

              {label === "provider" ? (
                <button
                  type="button"
                  onClick={() =>
                    this.props.sendDeleteMedFromPatient(id, med.id)
                  }
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}

          {label === "provider" ? (
            <button type="button" id="showMedForm" onClick={this.handleClick}>
              {this.state.showMedForm ? "Hide" : "Add Medication"}
            </button>
          ) : null}

          {label === "provider" && this.state.showMedForm ? (
            <form id="addMed" onSubmit={this.handleSubmit}>
              <select name="med">
                {this.props.meds
                  .filter(med => !medsIds.includes(med.id))
                  .map(med => (
                    <option key={med.id} value={med.id}>
                      {med.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about the indication, reported side effects, dosage, scheduling */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <h2>Providers</h2>
        <h2>Insurance</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ patient, problems, medClasses, meds, user }) => ({
  patient,
  problems,
  medClasses,
  meds,
  user
});
const mapDispatchToProps = {
  fetchPatient,
  deletePatient,
  sendAddProblemToPatient,
  sendDeleteProblemFromPatient,
  sendAddAllergyToPatient,
  sendDeleteAllergyFromPatient,
  sendAddMedToPatient,
  sendDeleteMedFromPatient,
  fetchInteractions,
  fetchOrphanMeds,
  fetchOrphanProblems
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SinglePatient);
