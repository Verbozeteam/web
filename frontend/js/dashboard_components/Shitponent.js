/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

class ShitponentZ extends React.Component<any, any> {
    render() {
        return (
            <div>
                <h3>DASHBOD - Hello World</h3>
            </div>
        );
    }
};
ShitponentZ.contextTypes = {
    store: PropTypes.object
};

export const Shitponent = ShitponentZ;
