import React from "react";
import { connect } from "react-redux";
import {
  fetchProblem,
  deleteProblem,
  sendAddTxClassToProblem,
  sendDeleteTxClassFromProblem
} from "../../redux/problem";
import { Link } from "react-router-dom";
import {sort} from "../../../util"

class SingleProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showTxClassForm: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchProblem(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteProblem(
        Number(this.props.match.params.id),
        this.props.history
      );
    } else if (e.target.id === "showTxClassForm") {
      this.setState(state => ({
        ...state,
        showTxClassForm: !state.showTxClassForm
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.id === "addTxClass") {
      this.props.sendAddTxClassToProblem(
        this.props.match.params.id,
        e.target.txClass.value
      );
    }
  }

  render() {
    const { name, id } = this.props.problem;
    const {label} = this.props.user

    const txClasses = this.props.problem.txClasses || [];
    const txClassesIds =
      txClasses.length > 0 ? txClasses.map(txClass => txClass.id) : [];

    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h3>Aliases:</h3>
          <h3>Diagnostic criteria:</h3>
          <button type="button">UpToDate</button>
          {label==='admin'?<div>
          <Link to={`/problems/${id}/edit`}>
            <button type="button">Edit Problem</button>
          </Link>
          <button type="button" id="delete" onClick={this.handleClick}>
            Delete Problem
          </button>
          </div>:null}
        </div>

        <div>
        <h2>Treatment classes</h2>

        {txClasses.sort(sort).map(txClass => (
            <div key={txClass.id}>
              {/* In the future will add a warning icon if patient receiving any medication with an txClass */}
              <Link to={`/medClasses/${txClass.id}`}>{txClass.name}</Link>
              {label==='admin'?<button
                type="button"
                onClick={() =>
                  this.props.sendDeleteTxClassFromProblem(id, txClass.id)
                }
              >
                Delete
              </button>:null}
            </div>
          ))}

          {label==='admin'?<button type="button" id="showTxClassForm" onClick={this.handleClick}>
            {this.state.showTxClassForm ? "Hide" : "Add Treatment Class"}
          </button>:null}

          {label==='admin'&&this.state.showTxClassForm ? (
            <form id="addTxClass" onSubmit={this.handleSubmit}>
              <select name="txClass">
                {this.props.medClasses
                  .filter(medClass => !txClassesIds.includes(medClass.id))
                  .map(medClass => (
                    <option key={medClass.id} value={medClass.id}>
                      {medClass.name}
                    </option>
                  ))}
              </select>
              {/* in the future, will be able to add details about when this txclass should be used for problem */}
              <button type="submit">Submit</button>
            </form>
          ) : null}
        </div>

        <h2>Analytics</h2>
      </div>
    );
  }
}

const mapStateToProps = ({ problem, medClasses, user }) => ({ problem, medClasses, user });
const mapDispatchToProps = {
  fetchProblem,
  deleteProblem,
  sendAddTxClassToProblem,
  sendDeleteTxClassFromProblem
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProblem);
