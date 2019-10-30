import React from "react";
import { connect } from "react-redux";
import { fetchMedClasses } from "../../redux/medClasses";
import { Link } from "react-router-dom";

class AllMedClasses extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.medClasses.map(medClass => (
          <div key={medClass.id}>
            <span>
              Name:
              <Link to={`/medClasses/${medClass.id}`}>{medClass.name}</Link>{" "}
            </span>
          </div>
        ))}
        <Link to='/medClasses/new'><button type='button'>Add New Med Class</button></Link>
      </div>
    )
  }
}

const mapStateToProps = ({ medClasses }) => ({ medClasses });
const mapDispatchToProps = { fetchMedClasses };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllMedClasses);
