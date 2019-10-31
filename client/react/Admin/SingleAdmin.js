import React from "react";
import { connect } from "react-redux";
import {
  fetchAdmin,
  deleteAdmin,
} from "../../redux/admin";
import { Link } from "react-router-dom";

class SingleAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (
      this.props.user.label &&
      this.props.user.label === "admin") {
      this.props.fetchAdmin(this.props.match.params.id);
    }
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteAdmin(
        Number(this.props.match.params.id),
        this.props.history
      );
    }
  }

  render() {
    if (!this.props.user) {
      return "Denied: Must be logged in";
    }

    if (
      this.props.user.label !== "admin"
    ) {
      return "Denied: Administrator access only";
    }

    const { id, name } = this.props.admin;
    const { id: userId } = this.props.user;

    const correctAdmin = userId===Number(this.props.match.params.id)

    return (
      <div>
          <h1>{name}</h1>
          <h2>ID: {id}</h2>
          {correctAdmin ? <div>
            <button type="button" id="delete" onClick={this.handleClick}>
            Delete Admin
          </button>
          <Link to={`/admins/${id}/edit`}>
            <button type="button">Edit Admin</button>
          </Link>
            </div> : null}
      </div>
    );
  }
}

const mapStateToProps = ({ admin, user }) => ({
  admin,
  user
});
const mapDispatchToProps = {
  fetchAdmin,
  deleteAdmin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleAdmin);
