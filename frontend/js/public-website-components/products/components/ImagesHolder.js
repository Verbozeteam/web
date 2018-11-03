/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
    images: Array<string>,
};

type StateType = {
};

export default class ImagesHolder extends React.Component<PropsType, StateType> {
    render() {
        const { images } = this.props;

        var each_col = Math.floor(12 / images.length);

        return (
            <div className="row" style={styles.frameContainer}>
                {images.map((image, i) =>
                    <div key={'image-' + i + '-' + image} className={["col-md-"+each_col]} style={styles.imageContainer}>
                        <img src={image} style={styles.image} />
                    </div>
                )}
            </div>
        );
    }
};

const styles = {
    frameContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        maxWidth: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
    }
};

