import React from "react";
import {connect} from 'react-redux'
import {createMed} from '../../redux/med'

class NewMedForm extends React.Component {
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
    this.props.createMed(this.state, this.props.history)
  }

  render() {
    if (this.props.user.label !== 'admin') {
      return 'Only administrators have access to this'
    }
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

const mapStateToProps = ({user}) => ({user})
const mapDispatchToProps = {createMed}

export default connect(mapStateToProps, mapDispatchToProps)(NewMedForm)