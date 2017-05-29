import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

/**
 * anonymous function - description
 *
 * @param  {type} ComponentRequiresAuth description
 * @return {type}                       description
 */
export default function (ComponentRequiresAuth) {
  /**
   *
   */
  class AlreadyAuthenticated extends React.Component {

    /**
     * componentWillMount - description
     *
     * @return {type}  description
     */
    componentWillMount() {
      if (this.props.isAuthenticated) {
        browserHistory.push('/documents');
      }
    }

    /**
     * render - description
     *
     * @return {type}  description
     */
    render() {
      return (
        <ComponentRequiresAuth {...this.props} />
      );
    }
  }

  AlreadyAuthenticated.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };


  /**
   * mapStateToProps - description
   *
   * @param  {type} state description
   * @return {type}       description
   */
  function mapStateToProps(state) {
    return {
      isAuthenticated: state.authorization.isAuthenticated
    };
  }

  return connect(mapStateToProps, {})(AlreadyAuthenticated);
}