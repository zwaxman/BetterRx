import React from "react";
import {connect} from 'react-redux'
import {editAdmin, fetchAdmin} from '../../redux/admin'

class EditAdminForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.admin.id || "",
      name: this.props.admin.name || "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchAdmin(this.props.match.params.id)
  }

  componentWillReceiveProps(newProps) {
    const newState = {}
    for (let key in this.state) {
      newState[key]=newProps.admin[key]
    }
    this.setState(newState)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.editAdmin(this.state, this.props.history)
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

const mapStateToProps = ({admin}) => ({admin})
const mapDispatchToProps = {editAdmin, fetchAdmin}

export default connect(mapStateToProps, mapDispatchToProps)(EditAdminForm)