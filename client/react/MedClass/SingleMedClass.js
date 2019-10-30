import React from "react";
import { connect } from "react-redux";
import {
  fetchMedClass,
  deleteMedClass,
  sendAddIndicationToMedClass,
  sendDeleteIndicationFromMedClass
} from "../../redux/medClass";
import { Link } from "react-router-dom";
import {sort} from "../../../util"

class SingleMedClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showIndicationForm: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchMedClass(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteProblem(
        Number(this.props.match.params.id),
        this.props.history
      );
    } else if (e.target.id === "showIndicationForm") {
      this.setState(state => ({
        ...state,
        showIndicationForm: !state.showIndicationForm
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.id === "addIndication") {
      this.props.sendAddIndicationToMedClass(
        this.props.match.params.id,
        e.target.indication.value
      );
    }
  }

  render() {
    const { name, id } = this.props.medClass;

    const indications = this.props.medClass.indications || [];
    const indicationsIds =
      indications.length > 0 ? indications.map(indication => indication.id) : [];

    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h3>Aliases:</h3>
          <button type="button">UpToDate</button>
          <Link to={`/medClasses/${id}/edit`}>
            <button type="button">Edit MedClass</button>
          </Link>
          <button type="button" id="delete" onClick={this.handleClick}>
            Delete MedClass
          </button>
        </div>

        <div>
          <h2>Indications</h2>

          {indications.sort(sort).map(indication => (
            <div key={indication.id}>
              <Link to={`/problems/${indication.id}`}>{indication.name}</Link>
              <button
                type="button"
                onClick={() =>
                  this.props.sendDeleteIndicationFromMedClass(id, indication.id)
                }
              >
                Delete
              </button>
            </div>
          ))}

          <button type="button" id="showIndicationForm" onClick={this.handleClick}>
            {this.state.showIndicationForm ? "Hide" : "Add Indication"}
          </button>

          {this.state.showIndicationForm ? (
            <form id="addIndication" onSubmit={this.handleSubmit}>
              <select name="indication">
                {this.props.problems
                  .filter(indication => !indicationsIds.includes(indication.id))
                  .map(indication => (
                    <option key={indication.id} value={indication.id}>
                      {indication.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about when this medClass should be used for indication */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <h2>Medications in Class</h2>
        <h2>Analytics</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ medClass, problems }) => ({ medClass, problems });
const mapDispatchToProps = {
  fetchMedClass,
  deleteMedClass,
  sendAddIndicationToMedClass,
  sendDeleteIndicationFromMedClass
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleMedClass);
