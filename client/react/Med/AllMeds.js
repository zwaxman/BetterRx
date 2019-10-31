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
        {this.props.user.label==='admin'?<Link to='/meds/new'><button type='button'>Add New Medication</button></Link>:null}
      </div>
    )
  }
}

const mapStateToProps = ({ meds, user }) => ({ meds, user });
const mapDispatchToProps = { fetchMeds };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllMeds);
