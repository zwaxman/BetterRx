import React from "react";
import { connect } from "react-redux";
import { fetchMeds } from "../../redux/meds";
import { Link } from "react-router-dom";

class AllMeds extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.meds.map(med => (
          <div key={med.id}>
            <span>
              Name:
              <Link to={`/meds/${med.id}`}>{med.name}</Link>{" "}
            </span>
          </div>
        ))}
        <Link to='/meds/new'><button type='button'>Add New Medication</button></Link>
      </div>
    )
  }
}

const mapStateToProps = ({ meds }) => ({ meds });
const mapDispatchToProps = { fetchMeds };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllMeds);
