import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import userLogin from '../../actions/LoginActions';

/**
 *
 */
class LandingPage extends React.Component {

  /**
   * render - description
   *
   * @return {type}  description
   */
  render() {
    const { userLogin } = this.props;
    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="container z-depth-4">
          <br />
          <h5 className="center-align"> Your documents. In one place. </h5>
          <LoginForm userLogin={userLogin} />
        </div>
      </div>
    );
  }
}

LandingPage.propTypes = {
  userLogin: React.PropTypes.func.isRequired
};

export default connect(null, { userLogin })(LandingPage);
