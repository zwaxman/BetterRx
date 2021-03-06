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
    const newState = {}
    for (let key in this.state) {
      newState[key]=newProps.medClass[key]
    }
    this.setState(newState)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.editMedClass(this.state, this.props.history)
  }

  render() {
    if (this.props.user.label !== 'admin') {
      return 'Only administrators have access to this'
    }
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

const mapStateToProps = ({medClass, user}) => ({medClass, user})
const mapDispatchToProps = {editMedClass, fetchMedClass}

export default connect(mapStateToProps, mapDispatchToProps)(EditMedClassForm)