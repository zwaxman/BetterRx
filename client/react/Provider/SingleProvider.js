import React from "react";
import { connect } from "react-redux";
import {
  fetchProvider,
  deleteProvider,
} from "../../redux/provider";
import { Link } from "react-router-dom";

class SingleProvider extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
      this.props.fetchProvider(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteProvider(
        Number(this.props.match.params.id),
        this.props.history
      );
    }
  }

  render() {
    const { id, name} = this.props.provider;
    const { label, id: userId } = this.props.user;
    const correctProviderOrAdmin = (label==='provider'&&userId===Number(this.props.match.params.id)) || label==='admin'
    console.log(correctProviderOrAdmin)

    return (
      <div>
          <h1>{name}</h1>
          <h2>MRN: {id}</h2>
          {correctProviderOrAdmin?<div>
          <button type="button" id="delete" onClick={this.handleClick}>
            Delete Provider
          </button>
          <Link to={`/providers/${id}/edit`}>
            <button type="button">Edit Provider</button>
          </Link>
          </div>:null}
        </div>
    );
  }
}

const mapStateToProps = ({ provider, user }) => ({
  provider,
  user
});
const mapDispatchToProps = {
  fetchProvider,
  deleteProvider,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleProvider);
