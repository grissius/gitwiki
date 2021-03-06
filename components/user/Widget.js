import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button } from 'antd';
import { getAccessToken, isLoggedIn } from '../../client/auth';
import { userType } from '../../client/propTypes';


export default class Widget extends React.PureComponent {
  static propTypes = {
    fetchUser: PropTypes.func.isRequired,
    user: userType.isRequired,
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    if (isLoggedIn()) {
      return (
        <Avatar size="large" src={this.props.user.avatar} />
      );
    }
    return (
      <Button
        type="primary"
        icon="github"
        onClick={getAccessToken}
      >Log in
      </Button>
    );
  }
}
