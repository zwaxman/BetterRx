import React from "react";
import { connect } from "react-redux";
import { fetchProviders } from "../../redux/providers";
import { Link } from "react-router-dom";

class AllProviders extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.providers.map(provider => (
          <div key={provider.id}>
            <span>
              Name:
              <Link to={`/providers/${provider.id}`}>{provider.name}</Link>{" "}
            </span>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = ({ providers, user }) => ({ providers, user });
const mapDispatchToProps = { fetchProviders };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllProviders);
