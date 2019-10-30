import React from "react";
import {connect} from 'react-redux'
import {editMedClass, fetchMedClass} from '../../redux/medClass'

class EditMedClassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.medClass.id || "",
      name: this.props.medClass.name || "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchMedClass(this.props.match.params.id)
  }

  componentWillReceiveProps(newProps) {
    this.setState(newProps.medClass)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.editMedClass(this.state, this.props.history)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
        </div>

        <button type="submit">Submit</button>
      </form>
    );
  }
}

const mapStateToProps = ({medClass}) => ({medClass})
const mapDispatchToProps = {editMedClass, fetchMedClass}

export default connect(mapStateToProps, mapDispatchToProps)(EditMedClassForm)