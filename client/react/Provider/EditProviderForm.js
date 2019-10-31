import React from "react";
import {connect} from 'react-redux'
import {editProvider, fetchProvider} from '../../redux/provider'

class EditProviderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.provider.id || "",
      name: this.props.provider.name || "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchProvider(this.props.match.params.id)
  }

  componentWillReceiveProps(newProps) {
    const newState = {}
    for (let key in this.state) {
      newState[key]=newProps.provider[key]
    }
    this.setState(newState)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.editProvider(this.state, this.props.history)
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

const mapStateToProps = ({provider}) => ({provider})
const mapDispatchToProps = {editProvider, fetchProvider}

export default connect(mapStateToProps, mapDispatchToProps)(EditProviderForm)