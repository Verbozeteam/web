/* @flow */

import React, { Component } from 'react';

import * as APITypes from '../js-api-utils/APITypes';
import { PublicWebsiteAPICaller } from '../js-api-utils/PublicWebsiteAPI';

import * as Cookies from 'js-cookie';

type PropsType = {};

type StateType = {
    /**
     * 0: form not submitted
     * 1: form submitting
     * 2: form submitted
     * 3: form error
    */
    submitStage: 0 | 1 | 2 | 3,
    errorMessage: string,
};

type FormData = {
    name: string,
    email: string,
    hotel: string,
    role: string,
    additionalInfo: string
};

export default class Contact extends Component<PropsType, StateType> {
    state = {
        submitStage: 0,
        errorMessage: "",
    };

    onKeyPress(event: Event) {
        /* Disable submit by Enter Key */
        if (event.which === 13) {
            event.preventDefault();
        }
    }

    onValidSubmit(formData: FormData) {
        this.setState({submitStage: 1});
        console.log(formData);
        console.log(JSON.stringify(formData));


        var csrftoken = Cookies.get('csrftoken');
        PublicWebsiteAPICaller.setCSRFToken(csrftoken);

        PublicWebsiteAPICaller.contactUs(
            formData,
            ((data: APITypes.ContactUs) => {
                this.setState({submitStage: 2});
                console.log(data);
            }).bind(this),
            ((error: APITypes.ErrorType) => {
                this.setState({submitStage: 3});
                this.setState({errorMessage: error.response.data.error})
                console.log("This is the error");
            }).bind(this)
        );
    }

    render() {
        <div>
            CALL TO ACTION FORM (CONTACT US OR REQUEST DEMO)
        </div>
    }
};
