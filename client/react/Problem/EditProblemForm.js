import React from "react";
import {connect} from 'react-redux'
import {editProblem, fetchProblem} from '../../redux/problem'

class EditProblemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.problem.id || "",
      name: this.props.problem.name || "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchProblem(this.props.match.params.id)
  }

  componentWillReceiveProps(newProps) {
    const newState = {}
    for (let key in this.state) {
      newState[key]=newProps.patient[key]
    }
    this.setState(newState)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.editProblem(this.state, this.props.history)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapStateToProps = ({problem}) => ({problem})
const mapDispatchToProps = {editProblem, fetchProblem}

export default connect(mapStateToProps, mapDispatchToProps)(EditProblemForm)