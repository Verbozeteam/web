import React from 'react';

export default class NiceButton extends React.Component {
    state = {
        hover: false,
    };

    render() {
        const { isHighlighted, extraStyle, onClick, children } = this.props;
        const { hover } = this.state;

        return (
            <div
                    onMouseEnter={() => this.setState({hover: true})}
                    onMouseLeave={() => this.setState({hover: false})}
                    onClick={onClick}
                    style={{...styles.container, ...extraStyle, ...(isHighlighted || hover ? styles.hoverStyle : {})}}>
                {children}
            </div>
        );
    }
};

const styles = {
    container: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ba3737',
        borderStyle: 'solid',
        color: 'white',
        backgroundColor: 'black',
        padding: 5,
        cursor: 'pointer',
    },
    hoverStyle: {
        backgroundColor: '#ba3737',
    },
};
