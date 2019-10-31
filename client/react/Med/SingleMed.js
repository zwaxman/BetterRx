import React from "react";
import { connect } from "react-redux";
import {
  fetchMed,
  deleteMed,
  sendAddMedClassToMed,
  sendDeleteMedClassFromMed
} from "../../redux/med";
import { Link } from "react-router-dom";
import {sort} from "../../../util"

class SingleMed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showMedClassForm: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchMed(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteMed(
        Number(this.props.match.params.id),
        this.props.history
      );
    } else if (e.target.id === "showMedClassForm") {
      this.setState(state => ({
        ...state,
        showMedClassForm: !state.showMedClassForm
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.id === "addMedClass") {
      this.props.sendAddMedClassToMed(
        this.props.match.params.id,
        e.target.medClass.value
      );
    }
  }

  render() {
    const { name, id } = this.props.med;
    const {label} = this.props.user

    const medClasses = this.props.med.medClasses || [];
    const medClassesIds =
      medClasses.length > 0 ? medClasses.map(medClass => medClass.id) : [];

    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h3>Aliases:</h3>
          <button type="button">UpToDate</button>
          {label==='admin'?<div>
          <Link to={`/meds/${id}/edit`}>
            <button type="button">Edit Medication</button>
          </Link>
          <button type="button" id="delete" onClick={this.handleClick}>
            Delete Medication
          </button>
          </div>:null}
        </div>

        <div>
        <h2>Medication class(es)</h2>

        {medClasses.sort(sort).map(medClass => (
            <div key={medClass.id}>
              {/* Most meds should only have one medication class */}
              <Link to={`/medClasses/${medClass.id}`}>{medClass.name}</Link>
              {label==='admin'?<button
                type="button"
                onClick={() =>
                  this.props.sendDeleteMedClassFromMed(id, medClass.id)
                }
              >
                Delete
              </button>:null}
            </div>
          ))}

          {label==='admin'?<button type="button" id="showMedClassForm" onClick={this.handleClick}>
            {this.state.showMedClassForm ? "Hide" : "Add Medication Class"}
          </button>:null}

          {label==='admin'&&this.state.showMedClassForm ? (
            <form id="addMedClass" onSubmit={this.handleSubmit}>
              <select name="medClass">
                {this.props.medClasses
                  .filter(medClass => !medClassesIds.includes(medClass.id))
                  .map(medClass => (
                    <option key={medClass.id} value={medClass.id}>
                      {medClass.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about when this medclass should be used for med */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <h2>Analytics</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ med, medClasses, user }) => ({ med, medClasses, user });
const mapDispatchToProps = {
  fetchMed,
  deleteMed,
  sendAddMedClassToMed,
  sendDeleteMedClassFromMed
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleMed);
