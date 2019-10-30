import React from "react";
import { connect } from "react-redux";
import { fetchMedClass, deleteMedClass, sendAddIndicationToMedClass, sendDeleteIndicationFromMedCall } from "../../redux/medClass";
import { Link } from "react-router-dom";

class SingleMedClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showIndicationForm: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchMedClass(this.props.match.params.id);
  }

  handleClick(e) {
    e.persist();
    if (e.target.id === "delete") {
      this.props.deleteProblem(
        Number(this.props.match.params.id),
        this.props.history
      );
    } else if (e.target.id === "showIndicationForm") {
      this.setState(state => ({
        ...state,
        showIndicationForm: !state.showIndicationForm
      }));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.id === "addTxClass") {
      this.props.sendAddTxClassToProblem(
        this.props.match.params.id,
        e.target.txClass.value
      );
    }
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
          <button type="button" id='delete' onClick={this.handleClick}>
            Delete MedClass
          </button>
        </div>

        <div>
        <h2>Indications</h2>

        </div>

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
