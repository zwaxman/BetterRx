import React from "react";
import { login } from "../../redux/user";
import { connect } from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(
      {
        id: e.target.id.value,
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
          <label htmlFor="id">ID or MRN:</label>
          <input type="text" name="id"></input>
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

const mapDispatchToProps = { login }

export default connect(null, mapDispatchToProps)(Login);
