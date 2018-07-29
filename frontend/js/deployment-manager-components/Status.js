import React from 'react';
import DataManager from './DataManager';
import NiceButton from './NiceButton';

export default class Status extends React.Component {
    render() {
        const { lock } = this.props;

        return (
            <div>
                <div style={styles.container}>
                    {lock.stdout.split('\n').map((line, i) =>
                        line.indexOf("~~~~") == 0 ? <div key={'errline-'+i} style={styles.cmdLine}>{line.substr(4)}</div>
                                                  : <div key={'errline-'+i} style={styles.stdoutLine}>{line}</div>
                    )}
                    <p style={styles.statusLine}>{lock.status == "" ? "Loading..." : ("Error: " + lock.status)}</p>
                </div>
                <div>
                    {lock.status == "" ? null :
                        <NiceButton onClick={() => DataManager.deleteLock(lock)}>
                            Ok
                        </NiceButton>
                    }
                </div>
            </div>
        );
    }
};

const styles = {
    container: {
        margin: 20,
    },
    cmdLine: {
        color: 'green',
    },
    stdoutLine: {
    },
    statusLine: {
        color: 'red',
    }
}
