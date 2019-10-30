import React from "react";
import { connect } from "react-redux";
import { fetchPatients } from "../../redux/patients";
import { Link } from "react-router-dom";

class AllPatients extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.patients.map(patient => (
          <div key={patient.id}>
            <span>
              Name:
              <Link to={`/patients/${patient.id}`}>{patient.name}</Link>{" "}
            </span>
            <span>Age: {patient.age} </span>
            <span>Sex: {patient.sex} </span>
            <span>Ethnicity: {patient.ethnicity}</span>
          </div>
        ))}
        <Link to='/patients/new'><button type='button'>Add New Patient</button></Link>
      </div>
    )
  }
}

const mapStateToProps = ({ patients }) => ({ patients });
const mapDispatchToProps = { fetchPatients };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllPatients);
