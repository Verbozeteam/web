/* @flow */

import React from 'react';

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
    top: '30%',
    left: '15%',
    height: '40%',
    width: '70%',
    opacity: 0
  };

  _modal_animation_open = {
    top: '20%',
    left: '5%',
    height: '60%',
    width: '90%',
    opacity: 1
  };

  _overlay_animation_visible = {
    opacity: 0.7
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

    var overlay_style;
    if (open) {
      if (transition_stage == 0) {
        overlay_style = {
          ...styles.overlay,
          ...this._overlay_animation_hidden
        };
      } else {
        overlay_style = {
          ...styles.overlay,
          ...this._overlay_animation_visible
        };
      }
    }

    else {
      if (transition_stage == 0) {
        overlay_style = {
          ...styles.overlay,
          ...this._overlay_animation_visible
        };
      } else {
        overlay_style = {
          ...styles.overlay,
          ...this._overlay_animation_hidden
        };
      }
    }

    return (
      <div style={overlay_style}
        onClick={toggle}></div>
    );
  }

  _renderModal() {
    const { open } = this.props;
    const { transition_stage } = this.state;

    var modal_style;
    if (open) {
      if (transition_stage == 0) {
        modal_style = {
          ...styles.modal,
          ...this._modal_animation_closed
        };
      } else {
        modal_style = {
          ...styles.modal,
          ...this._modal_animation_open
        };
      }
    }

    else {
      if (transition_stage == 0) {
        modal_style = {
          ...styles.modal,
          ...this._modal_animation_open
        };
      } else {
        modal_style = {
          ...styles.modal,
          ...this._modal_animation_closed
        };
      }
    }

    return (
      <div style={modal_style}>
        <div style={styles.modal_header}>
          <h2 style={styles.modal_title}>Request Demo</h2>
        </div>
        <div style={styles.modal_content}>
          {this._renderForm()}
        </div>
      </div>
    );
  }

  _renderForm() {
    const name_field = <input type='text' placeholder='Your Name'
      style={{...styles.input_field, ...styles.input_field_pull_right}} />;

    const email_field = <input type='email' placeholder='Your Email'
      style={{...styles.input_field, ...styles.input_field_pull_left}} />;

    const hotel_field = <input type='text' placeholder='Your Hotel'
      style={{...styles.input_field, ...styles.input_field_pull_right}} />;

    const role_field = <input type='text' placeholder='Your Role'
      style={{...styles.input_field, ...styles.input_field_pull_left}} />;

    return (
      <form>
        <div className='row'>
          <div className='col-sm-6'>
            {name_field}
          </div>
          <div className='col-sm-6'>
            {email_field}
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            {hotel_field}
          </div>
          <div className='col-sm-6'>
            {role_field}
          </div>
        </div>
      </form>
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

    if (transition_stage < 2) {
      requestAnimationFrame(() => {
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
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#000000',
    transition: '250ms ease-in-out'
  },
  modal: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    transition: '250ms ease-in-out'
  },
  modal_header: {
    padding: 20,
    textAlign: 'center'
  },
  modal_title: {

  },
  modal_content: {

  },
  input_field: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    width: '70%'
  },
  input_field_pull_right: {
    marginLeft: '27%'
  },
  input_field_pull_left: {
    marginLeft: '3%'
  }
}

module.exports = RequestDemoModal;
