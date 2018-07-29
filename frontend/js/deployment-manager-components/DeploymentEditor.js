import React from 'react';
import NiceButton from './NiceButton';
import DataManager from './DataManager';

export default class DeploymentEditor extends React.Component {
    render() {
        const { deployment } = this.props;

        var params = DataManager.getDeploymentParameters(deployment);
        var buildOptions = DataManager.getDeploymentBuildOptions(deployment);

        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <div style={styles.fieldName}>ID</div>
                    <div style={styles.fieldValue}>{deployment.id}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Target</div>
                    <div style={styles.fieldValue}>{deployment.target}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Date</div>
                    <div style={styles.fieldValue}>{deployment.date}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Comment</div>
                    <div style={styles.fieldValue}>{deployment.comment.split('\r\n').map((line, i) => <div key={'cline-'+i}>{line}</div>)}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Build Options:</div>
                    <div style={styles.fieldValue}></div>
                </div>
                {buildOptions.map((buildOption, i) =>
                    <div key={"boline-"+i} style={styles.row}>
                        <div style={styles.fieldName}>&#10003;</div>
                        <div style={styles.fieldValue}>{buildOption.option_name}</div>
                    </div>
                )}
                <div style={styles.row}>
                    <div style={styles.fieldName}>Parameters:</div>
                    <div style={styles.fieldValue}></div>
                </div>
                {params.map((param, i) =>
                    <div key={"pline-"+i} style={styles.row}>
                        <div style={styles.fieldName}>{param.parameter_name}</div>
                        <div style={styles.fieldValue}>{param.parameter_value}</div>
                    </div>
                )}
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
    },
    fieldName: {
        fontWeight: 'bold',
        color: '#ba3737',
        flex: 1,
        textAlign: 'right',
        marginRight: 20,
    },
    fieldValue: {
        flex: 3,
    },
};
