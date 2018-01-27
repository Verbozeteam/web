/* @flow */

import React from 'react';

import * as APITypes from '../js-api-utils/APITypes';
import { PublicWebsiteAPICaller } from '../js-api-utils/PublicWebsiteAPI';

import * as Cookies from 'js-cookie';

import css from '../../css/public_website/ContactOrDemoForm.css';

type PropsType = {
    requestDemo: boolean,
    toggle?: () => null
};

type StateType = {
    /**
     * 0: form not submitted
     * 1: form submitting
     * 2: form submitted
     * 3: form error
    */
    submitStage: 0 | 1 | 2 | 3,
};

type FormDataType = {
    name: string,
    email: string,
    hotel: string,
    role: string,
    additionalInfo: string
};

export default class ContactOrDemoForm extends React.Component<PropsType, StateType> {
    static defaultProps = {
        toggle: () => null
    }

    state = {
        submitStage: 0
    };

    onKeyPress(event: Event) {
        /* Disable submit by Enter Key */
        if (event.which === 13){
            event.preventDefault();
        }
    }

    onValidSubmit(e: Event) {
        e.preventDefault();
        this.setState({submitStage: 1});

        var form = this.props.requestDemo ? document.forms.namedItem("request-demo-form") : document.forms.namedItem("contact-form");

        var name = form.elements.namedItem('inputName').value;
        var email = form.elements.namedItem('inputEmail').value;
        var hotel = form.elements.namedItem('inputHotel').value;
        var role = form.elements.namedItem('inputRole').value;
        var additionalInfo = form.elements.namedItem('inputAdditionalInfo').value;

        var formData = {
            name: name,
            email: email,
            hotel: hotel,
            role: role,
            additionalInfo: additionalInfo,
            requestDemo: this.props.requestDemo
        }

        var csrftoken = Cookies.get('csrftoken');
        PublicWebsiteAPICaller.setCSRFToken(csrftoken);

        PublicWebsiteAPICaller.contactUs(
            formData,
            ((data: APITypes.ContactUs) => {
                this.setState({submitStage: 2});
            }).bind(this),
            ((error: APITypes.ErrorType) => {
                this.setState({submitStage: 3});
            }).bind(this)
        );

        return false;
    }

    renderSubmitButton() {
        var displayText = this.props.requestDemo ? "REQUEST DEMO" : "SUBMIT" ;

        if (this.state.submitStage === 0) {
            return (
                <button
                    className={ this.props.requestDemo ? "btn submit-button" : "btn submit-button contact-submit-button" }
                    onClick={ () => {document.getElementById("submit-form-button").click() }}>
                        { displayText }
                </button>
            );
        }
        else if (this.state.submitStage === 1) {
            return (
                <button
                    className="btn submit-button submitting-form"
                    onClick={ () => {document.getElementById("submit-form-button").click() }}
                    disabled
                >
                    <i className="fa fa-refresh fa-spin fa-fw"></i>
                </button>
            );
        }
    }

    render() {
        var submitSuccessMessage = this.props.requestDemo ? "submitting your request" : "contacting us";

        if (this.state.submitStage === 2) {
            return (
                <div className={ this.props.requestDemo ? "container request-demo-container" : "container contact-container" } >
                    <h5 style={{ textAlign: 'center' }}>Thank you for { submitSuccessMessage }! We will reach out to you shortly.</h5>
                </div>
            )
        }
        else {
            return (
                <div className={ this.props.requestDemo ? "container request-demo-container" : "container contact-container" } >
                    <form
                        id={ this.props.requestDemo ? "request-demo-form-id" : "contact-form-id" }
                        name={ this.props.requestDemo ? "request-demo-form" : "contact-form" }
                        onSubmit={(event) => { this.onValidSubmit(event) }} onKeyPress={ (event) => {this.onKeyPress(event) }}
                    >
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="text" className="form-control" id="inputName" placeholder="Your Name" name="inputName" required />
                            </div>
                            <div className="form-group col-md-6">
                                <input type="email" className="form-control" id="inputEmail" placeholder="Your Email" name="inputEmail" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <input type="text" className="form-control" id="inputHotel" placeholder="Your Hotel" name="inputHotel" required />
                            </div>
                            <div className="form-group col-md-6">
                                <input type="text" className="form-control" id="inputRole" placeholder="Your Role" name="inputRole" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <textarea type="text" className="form-control" id="inputAdditionalInfo" placeholder="Tell us a little bit more about your meeds" name="inputAdditionalInfo" required />
                        </div>
                        <button type="submit" id="submit-form-button" style={{ display: "none"}}></button>
                    </form>
                    <div style={{overflow: 'hidden'}}>
                      <div className="form-row form-buttons">
                          { this.renderSubmitButton() }
                          <button className="btn cancel-button" onClick={this.props.toggle} style={ this.props.requestDemo ? { display: 'block' } : { display: 'none' } }>Cancel</button>
                      </div>
                    </div>
                </div>
            );
        }

    }
}
