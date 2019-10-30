import React from "react";
import { connect } from "react-redux";
import { fetchProblem, deleteProblem } from "../../redux/problem";
import { Link } from "react-router-dom";

class SingleProblem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchProblem(this.props.match.params.id);
  }

  handleClick() {
    this.props.deleteProblem(Number(this.props.match.params.id), this.props.history);
  }

  render() {
    const { name, id } = this.props.problem;
    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h3>Aliases:</h3>
          <h3>Diagnostic criteria:</h3>
          <button type='button'>UpToDate</button>
          <Link to={`/problems/${id}/edit`}><button type='button'>Edit Problem</button></Link>
          <button type="button" onClick={this.handleClick}>
            Delete Problem
          </button>
        </div>

        <h2>Treatment medication classes</h2>
          <h2>Analytics</h2>

      </div>
    );
  }
}

const mapStateToProps = ({ problem }) => ({ problem });
const mapDispatchToProps = { fetchProblem, deleteProblem };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProblem);
