import React from "react";
import {connect} from 'react-redux'
import {createPatient} from '../../redux/patient'

class NewPatientForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      age: "",
      sex: "",
      ethnicity: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.createPatient(this.state, this.props.history)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" onChange={this.handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age (yrs):</label>
          <input
            type="number"
            name="age"
            min="0"
            onChange={this.handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            name="sex"
            value="male"
            onChange={this.handleChange}
          ></input>
          <label htmlFor="female">Female</label>
          <input
            type="radio"
            name="sex"
            value="female"
            onChange={this.handleChange}
          ></input>
        </div>

        <div className="form-group">
          <label htmlFor="ethnicity">Ethnicity:</label>
          <label htmlFor="white">White</label>
          <input
            type="radio"
            name="ethnicity"
            value="white"
            onChange={this.handleChange}
          ></input>
          <label htmlFor="black">Black</label>
          <input
            type="radio"
            name="ethnicity"
            value="black"
            onChange={this.handleChange}
          ></input>
          <label htmlFor="hispanic">Hispanic</label>
          <input
            type="radio"
            name="ethnicity"
            value="hispanic"
            onChange={this.handleChange}
          ></input>
          <label htmlFor="asian">Asian</label>
          <input
            type="radio"
            name="ethnicity"
            value="asian"
            onChange={this.handleChange}
          ></input>
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapDispatchToProps = {createPatient}

export default connect(null, mapDispatchToProps)(NewPatientForm)