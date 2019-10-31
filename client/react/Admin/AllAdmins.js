import React from "react";
import { connect } from "react-redux";
import { fetchAdmins } from "../../redux/admins";
import { Link } from "react-router-dom";

class AllAdmins extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.user.label !== 'admin' || (!this.props.user)) {
      return 'Denied: Administrator access only'
    }
    return (
      <div>
        {this.props.admins.map(admin => (
          <div key={admin.id}>
            <span>
              Name:
              <Link to={`/admins/${admin.id}`}>{admin.name}</Link>{" "}
            </span>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = ({ admins, user }) => ({ admins, user });
const mapDispatchToProps = { fetchAdmins };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllAdmins);
