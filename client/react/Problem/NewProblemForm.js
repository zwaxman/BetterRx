import React from "react";
import {connect} from 'react-redux'
import {createProblem} from '../../redux/problem'

class NewProblemForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createProblem(this.state, this.props.history)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" onChange={this.handleChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapDispatchToProps = {createProblem}

export default connect(null, mapDispatchToProps)(NewProblemForm)