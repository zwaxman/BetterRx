import React from "react";
import { connect } from "react-redux";
import { fetchMedClass, deleteMedClass } from "../../redux/medClass";
import { Link } from "react-router-dom";

class SingleMedClass extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchMedClass(this.props.match.params.id);
  }

  handleClick() {
    this.props.deleteMedClass(Number(this.props.match.params.id), this.props.history);
  }

  render() {
    const { name, id } = this.props.medClass;
    return (
      <div>
        <div id="header">
          <h1>{name}</h1>
          <h3>Aliases:</h3>
          <button type='button'>UpToDate</button>
          <Link to={`/medClasses/${id}/edit`}><button type='button'>Edit MedClass</button></Link>
          <button type="button" onClick={this.handleClick}>
            Delete MedClass
          </button>
        </div>

        <h2>Indications</h2>
          <h2>Medications in Class</h2>
          <h2>Analytics</h2>

      </div>
    );
  }
}

const mapStateToProps = ({ medClass }) => ({ medClass });
const mapDispatchToProps = { fetchMedClass, deleteMedClass };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleMedClass);
