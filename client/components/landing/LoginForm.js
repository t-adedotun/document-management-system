import React from 'react';
import { browserHistory } from 'react-router';
/**
 *
 */
class LoginForm extends React.Component {

  /**
   * constructor - description
   *
   * @param  {type} props description
   * @return {type}       description
   */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  /**
   * onSubmit - description
   *
   * @param  {type} event description
   * @return {type}       description
   */
  onSubmit(event) {
    event.preventDefault();
    this.props.userLogin(this.state).then(() => {
      browserHistory.push('/documents');
    })
    .catch(() => {

    });
  }


  /**
   * onChange - description
   *
   * @param  {type} event description
   * @return {type}       description
   */
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * render - description
   *
   * @return {type}  description
   */
  render() {
    return (
      <div className="input-field col s12">
        <form onSubmit={this.onSubmit}>
          <div>
            <div className="input-field">
              <input
                className="validate"
                value={this.state.email}
                onChange={this.onChange}
                type="email"
                id="email"
                name="email" required
              />
              <label className="active" htmlFor="email">Email</label>
            </div>
            <br />
            <br />
            <div className="input-field">
              <input
                value={this.state.password}
                onChange={this.onChange}
                type="password"
                id="password"
                name="password"
                required
              />
              <label className="active" htmlFor="password">Password</label>
            </div>
            <br />
            <br />
            <button className="btn cyan" type="submit">Enter</button>
          </div>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  userLogin: React.PropTypes.func.isRequired
};

export default LoginForm;
