/* @flow */

import { APICallerClass } from './API';

import * as APITypes from './APITypes';

class PublicWebsiteAPICallerClass extends APICallerClass {
    createToken(success: (APITypes.CreatedToken) => any, failure?: (APITypes.ErrorType) => any) {
        this.__makeRequest('post', '/api/tokens/', {}, success, failure);
    }

	contactUs(formData: Object, success: (APITypes.ContactUs) => any, failure?: (APITypes.ErrorType) => any) {
		this.__makeRequest('post', '/api/contact-us/', {data: formData}, success, failure);
	}

}

export const PublicWebsiteAPICaller = new PublicWebsiteAPICallerClass()
