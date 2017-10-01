import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import moment from 'moment';
import config from 'config';

import Helmet from 'react-helmet'
import Payment from 'components/Payment';
import RelatedPost from 'components/RelatedPost';
import Timer from 'components/Timer';
import UserList from 'components/UserList';
import PinnedDocument from 'components/PinnedDocument';

import styles from './styles.css';


class Intro extends Component {

  static initial() {
    const sessionName = moment().format('YYYYMMDD');
    const url = 'http://api.goingsunny.com/api/v1';
    const query = JSON.stringify({
      sessionName,
      roomName: '',
    });
    return fetch(`${url}/session?populate=_user&query=${query}`, {
      method: 'GET'
    })
    .then(response => { return response.json(); })
    .then(models => {
      return models.map(i => i._user);
    });
  }

  static getPinnedDocument() {
    const url = 'http://api.goingsunny.com/api/v1';
    return fetch(`${url}/pinedPost?query={"state": "public"}`, {
      method: 'GET'
    })
    .then(response => { return response.json(); });
  }

  constructor(props) {
    super(props);
    this.state = {
      busy: false,
      joinedUsers: [],
      pinnedDocument: []
    }
  }

  componentDidMount() {
    Intro.initial().then(body => {
      this.setState({ joinedUsers: body });
    })
    .catch(err => {
      this.setState({ err });
    });

    Intro.getPinnedDocument().then(body => {
      this.setState({ pinnedDocument: body });
    })
    .catch(err => {
      this.setState({ err });
    });
  }

  render() {
    return (
      <div className={styles.main}>
        <Helmet title="A first online English club in Vietnam" />

        <div className="container">
          <Timer />
          <UserList model={this.state.joinedUsers} />
          <PinnedDocument model={this.state.pinnedDocument} />
          <Payment />
        </div>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(Intro)