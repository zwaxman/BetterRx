import React from "react";
import {connect} from 'react-redux'
import {editPatient, fetchPatient} from '../../redux/patient'

class EditPatientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.patient.id || "",
      name: this.props.patient.name || "",
      age: this.props.patient.age || "",
      sex: this.props.patient.sex || "",
      ethnicity: this.props.patient.ethnicity || ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchPatient(this.props.match.params.id)
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
    this.props.editPatient(this.state, this.props.history)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age (yrs):</label>
          <input
            type="number"
            name="age"
            min="0"
            value={this.state.age}
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
            checked={this.state.sex==='male'}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="female">Female</label>
          <input
            type="radio"
            name="sex"
            value="female"
            checked={this.state.sex==='female'}
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
            checked={this.state.ethnicity==='white'}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="black">Black</label>
          <input
            type="radio"
            name="ethnicity"
            value="black"
            checked={this.state.ethnicity==='black'}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="hispanic">Hispanic</label>
          <input
            type="radio"
            name="ethnicity"
            value="hispanic"
            checked={this.state.ethnicity==='hispanic'}
            onChange={this.handleChange}
          ></input>
          <label htmlFor="asian">Asian</label>
          <input
            type="radio"
            name="ethnicity"
            value="asian"
            checked={this.state.ethnicity==='asian'}
            onChange={this.handleChange}
          ></input>
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapStateToProps = ({patient}) => ({patient})
const mapDispatchToProps = {editPatient, fetchPatient}

export default connect(mapStateToProps, mapDispatchToProps)(EditPatientForm)