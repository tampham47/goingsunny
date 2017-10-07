import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from 'core/Header';
import Modal from 'core/Modal';

import User from './UserInfo';
import MatchedGroup from './MatchedGroup';
import styles from './styles.css';


class UserList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      joinedList: props.model || [],
      isMatched: false,
      room: '',
    }

    this.userEntered = this.userEntered.bind(this);
    this.matched = this.matched.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  userEntered(e) {
    const joinedList = this.state.joinedList;
    joinedList.push(e.detail);

    this.setState({ joinedList });
  }

  matched(e) {
    const data = e.detail;
    this.setState({
      isMatched: true,
      room: data.channel,
    });
  }

  dismiss() {
    this.setState({ isMatched: false });
  }

  componentDidMount() {
    // this will fired when people join the class
    window.addEventListener('SYSTEM_CLASS_DATA', this.userEntered);
    const user = this.state.user;
    console.log('Subscribe', user._id);
    if (user._id) {
      window.addEventListener(`SYSTEM_${user._id}`, this.matched);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('SYSTEM_CLASS_DATA', this.userEntered);
    const user = this.state.user;
    if (user.id) {
      window.removeEventListener(`SYSTEM_${user._id}`, this.matched);
    }
  }

  componentWillReceiveProps(next) {
    if (this.props.model !== next.model) {
      this.setState({ joinedList: next.model });
    }
    if (this.props.user !== next.user) {
      const user = next.user;
      this.setState({ user });
      if (user._id) {
        console.log('Subscribe', user._id);
        window.addEventListener(`SYSTEM_${user._id}`, this.matched);
      }
    }
  }

  render() {
    return (
      <section className={styles.main}>
        <Header title="joinedList have joined next session" />
        <div className={styles.userList}>
          {this.state.joinedList.map(function(item, index) {
            return (
              <div key={index} className={styles.userItem}>
                <User model={item}/>
              </div>
            )
          })}
        </div>

        {this.state.isMatched && (
        <Modal isShow={this.state.isMatched} dismiss={this.dismiss}>
          <MatchedGroup
            user1={this.state.user}
            user2={null}
            room={this.state.room}
          />
        </Modal>
        )}
      </section>
    )
  }
}

export default UserList;