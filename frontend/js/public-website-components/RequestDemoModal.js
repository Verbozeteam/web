/* @flow */

import React from 'react';

import css from '../../css/public_website/RequestDemoModal.css';

import ContactOrDemoForm from './ContactOrDemoForm';

type PropsType = {
  open: boolean,
  toggle: () => null
};

type StateType = {
  transition_stage: number /* 0 initial, 1 animating, 2 done */
};

class RequestDemoModal extends React.Component<PropsType, StateType> {

  static defaultProps = {
    open: true,
    toggle: () => null
  };

  state = {
    transition_stage: 2
  };

  _modal_animation_closed = {
    marginTop: '30vh',
    marginLeft: '10vw',
    width: '80%',
    opacity: 0
  };

  _modal_animation_open = {
    marginTop: '15vh',
    marginBottom: '15vh',
    marginLeft: '5vw',
    width: '90%',
    opacity: 1
  };

  _overlay_animation_visible = {
    opacity: 0.8
  };

  _overlay_animation_hidden = {
    opacity: 0
  };

  componentWillReceiveProps(nextProps: PropsType) {
    const { open } = this.props;

    /* set animation to initial stage */
    if (open !== nextProps.open) {
      this.setState({
        transition_stage: 0
      });
    }
  }

  _renderOverlay() {
    const { open, toggle } = this.props;
    const { transition_stage } = this.state;

    /* decide which styling to apply - either animation initial or end */
    var overlay_style;
    if ((open && transition_stage !== 0) || (!open && transition_stage == 0)) {
      overlay_style = {
        ...styles.overlay,
        ...this._overlay_animation_visible
      };
    }

    else {
      overlay_style = {
        ...styles.overlay,
        ...this._overlay_animation_hidden
      };
    }

    return (
      <div style={overlay_style}
        onClick={toggle}></div>
    );
  }

  _renderModal() {
    const { open } = this.props;
    const { transition_stage } = this.state;

    /* decide which styling to apply - either animation initial or end */
    var modal_style;
    if ((open && transition_stage !== 0) || (!open && transition_stage == 0)) {
      modal_style = {
        ...styles.modal,
        ...this._modal_animation_open
      };
    }

    else {
      modal_style = {
        ...styles.modal,
        ...this._modal_animation_closed
      };
    }

    return (
      <div style={styles.modal_container}>
        <div style={modal_style}>
          <div className="container modal-header-container" style={styles.modal_header}>
            <h2 style={styles.modal_title}>Request A Demo</h2>
            <h5 style={styles.modal_sub_title}>Some sentence describing what a demo means, and how they can benifit from it, being free and all.</h5>
          </div>
          <div style={styles.modal_content}>
            <ContactOrDemoForm requestDemo={true} toggle={this.props.toggle}/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { open } = this.props;
    const { transition_stage } = this.state;

    var modal = null;
    var overlay = null;
    if (open || transition_stage < 2) {
      modal = this._renderModal();
      overlay = this._renderOverlay();
    }

    /* increment transition stage */
    if (transition_stage < 2) {
      requestAnimationFrame(() => {

        /* if modal exiting, set timeout before modal is actually removed */
        var duration = 0;
        if (!open && transition_stage == 1) {
          duration = 200;
        }

        setTimeout(() => {
          this.setState({
            transition_stage: transition_stage + 1
          });
        }, duration);
      });
    }

    /* create container style - let pointer events pass through when modal
       closed */
    const container_style = {
      ...styles.container,
      pointerEvents: (open) ? 'all' : 'none'
    };

    /* set body scroll */
    const body = document.body;
    if (open) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'scroll';
    }

    return (
      <div style={container_style}>
        {overlay}
        {modal}
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    zIndex: 9999999,
    overflow: 'scroll'
  },
  overlay: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    transition: '250ms ease-in-out'
  },
  modal_container: {
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    transition: '250ms ease-in-out',
    color: 'black',
    pointerEvents: 'all'
  },
  modal_header: {
    paddingTop: 50,
    textAlign: 'center',
    width: 850,
    margin: '0 auto',
  },
  modal_title: {
    fontWeight: 'lighter'
  },
  modal_sub_title: {
    fontWeight: 'lighter',
    paddingTop: 20
  },
  modal_content: {
    paddingBottom: 50,
  },
}



module.exports = RequestDemoModal;
