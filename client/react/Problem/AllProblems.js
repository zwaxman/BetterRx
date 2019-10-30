import React from "react";
import { connect } from "react-redux";
import { fetchProblems } from "../../redux/problems";
import { Link } from "react-router-dom";

class AllProblems extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.problems.map(problem => (
          <div key={problem.id}>
            <span>
              Name:
              <Link to={`/problems/${problem.id}`}>{problem.name}</Link>{" "}
            </span>
          </div>
        ))}
        <Link to='/problems/new'><button type='button'>Add New Problem</button></Link>
      </div>
    )
  }
}

const mapStateToProps = ({ problems }) => ({ problems });
const mapDispatchToProps = { fetchProblems };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllProblems);
