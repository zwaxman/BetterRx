import React from "react";
import { signup } from "../../redux/user";
import { connect } from 'react-redux'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.signup(
      {
        name: e.target.name.value,
        role: e.target.role.value,
        password: e.target.password.value
      },
      this.props.history
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name"></input>
        </div>

        <div>
          <label htmlFor="role">Role:</label>
          <select name="role">
            <option value="patient">Patient</option>
            <option value="provider">Provider</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password"></input>
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapDispatchToProps = { signup }

export default connect(null, mapDispatchToProps)(Signup);
