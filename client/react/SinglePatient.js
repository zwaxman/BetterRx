import React from "react";
import { connect } from "react-redux";
import { fetchPatient } from '../redux/patient'

class SinglePatient extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPatient(this.props.match.params.id);
  }

  render() {
      const patient = this.props.patient
    return (
      <div key={patient.id}>
        <div>Name: {patient.name}</div>
        <div>Age: {patient.age}</div>
        <div>Sex: {patient.sex}</div>
        <div>Ethnicity: {patient.ethnicity}</div>
        <div>Diseases:</div>
        <div>Allergies:</div>
        <div>Insurance:</div>
      </div>
    );
  }
}

const mapStateToProps = ({patient}) => ({patient})
const mapDispatchToProps = {fetchPatient}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePatient)


