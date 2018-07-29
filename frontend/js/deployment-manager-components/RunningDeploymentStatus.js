import React from 'react';

export default class RunningDeploymentStatus extends React.Component {

    static defaultProps = {
        runningDeployment: null,
    }

    styleLine(line, i) {
        if (line.indexOf("~~~~") == 0) {
            return <div key={'errline-'+i} style={styles.cmdLine}>{line.substr(4)}</div>
        }
        else if (line.indexOf("~==~") == 0) {
            return <div key={'errline-'+i} style={styles.actionLine}>{line.substr(4)}</div>
        }
        else {
            return <div key={'errline-'+i} style={styles.stdoutLine}>{line}</div>
        }
    }

    render() {
        const { runningDeployment } = this.props;

        if (runningDeployment) {
            return (
                <div style={styles.container}>
                    <div style={styles.containerContent}>
                        <h2>Running Deployment on: { runningDeployment.deployment.target }</h2>
                        {runningDeployment.stdout.split('\n').map((line, i) =>
                            this.styleLine(line, i)
                        )}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div style={styles.container}>
                    <h2>Invalid Running Deployment Id</h2>
                </div>
            );
        }
    }
}

const styles = {
    container: {
        flex: 5,
        flexDirection: 'column',
        maxHeight: '100vh',
        overflow: 'scroll'
    },
    containerContent:{
        marginLeft: 10
    },
    cmdLine: {
        color: 'green',
    },
    stdoutLine: {
    },
    statusLine: {
        color: 'red',
    },
    actionLine: {
        color: '#d3d017',
    }
};