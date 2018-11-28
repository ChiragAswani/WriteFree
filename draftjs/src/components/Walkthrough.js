import React from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import Joyride from 'react-joyride';
import PropTypes from 'prop-types';

class Walkthrough extends React.Component {
  handleJoyrideCallback(data) {
    const { joyride } = this.props;
    if (typeof joyride.callback === 'function') {
      joyride.callback(data);
    }
  }

  async removeTutorial(email) {
    const removeTutorial = {
      method: 'POST',
      url: 'http://127.0.0.1:5000/remove-tutorial',
      qs: { email },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    await request(removeTutorial);
  }

  render() {
    return (
      <Joyride
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        run={this.props.runTutorial}
        spotlightPadding={false}
        steps={[
            {
                content: <h2>Write Free Tutorial</h2>,
                placement: 'center',
                disableBeacon: true,
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
                locale: { skip: <a onClick={() => this.removeTutorial(localStorage.getItem('email'))}>Don't Show This Again</a> },
                target: 'body',
            },
            {
                content: 'Click here to create a new note!',
                placement: 'bottom',
                styles: {
                    options: {
                        width: 900,
                    },
                },
                target: '.generateNewNote',
                title: 'Create a New Note',
            },
            {
                content: 'Click here to change default settings!',
                placement: 'bottom',
                styles: {
                    options: {
                        width: 900,
                    },
                },
                target: '.defaultSettings',
                title: 'Change Default Note Settings',
            },
            {
                content: 'Here you can edit a note',
                placement: 'bottom',
                styles: {
                    options: {
                        width: 900,
                    },
                },
                target: '.editNote',
                title: 'Edit a Note',
            }, {
                content: 'Here you can delete a note',
                placement: 'bottom',
                styles: {
                    options: {
                        width: 900,
                    },
                },
                target: '.deleteNote',
                title: 'Delete a Note',
            }]
        }
        callback={() => this.handleJoyrideCallback}
      />
    );
  }
}

Walkthrough.propTypes = {
  joyride: PropTypes.func,
  runTutorial: PropTypes.bool,
};

export default withRouter(Walkthrough);
