/* @flow */

import * as React from 'react';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import type { ThingMetadataType, ThingStateType } from '../js-api-utils/ConfigManager';

import * as Styles from '../constants/Styles';

type PropsType = {
    id: string,
    roomId: string,
    isSummary: boolean,
};
type StateType = {
    /*
    /* 0 - OK
    /* 1 - IDLE
    /* 2 - RUNNING
    /* 3 - ERROR
    */
    status: number,
    errors: Array<{[string]: string}>
};

export default class RoomDiagnostics extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    state = {
        status: 1,
        errors: [],
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps: PropsType) {
        this._unsubscribe();
        if (newProps.id && newProps.roomId) {
            this._unsubscribe = RoomConfigManager.getConfigManager(newProps.roomId).registerThingStateChangeCallback(newProps.id, this.onRoomDiagnosticsStatusChanged.bind(this));
            if (newProps.id in RoomConfigManager.getConfigManager(newProps.roomId).things)
                this.onRoomDiagnosticsStatusChanged(RoomConfigManager.getConfigManager(newProps.roomId).thingMetas[newProps.id], RoomConfigManager.getConfigManager(newProps.roomId).things[newProps.id]);
        }
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRoomDiagnosticsStatusChanged(meta: ThingMetadataType, roomDiagnosticsState: ThingStateType) {
        const { roomId } = this.props;

        if ('status' in roomDiagnosticsState.report) {
            switch (roomDiagnosticsState.report.status) {
                case 0:
                    /* status OK */
                    this.setState({
                        status: 0
                    });
                    break;
                case 1:
                    /* status IDLE */
                    this.setState({
                        status: 1
                    });
                    break;
                case 2:
                    /* status RUNNING */
                    this.setState({
                        status: 2
                    });
                    break;
                case 3:
                    /* status ERROR */
                    this.setState({
                        status: 3,
                        errors: roomDiagnosticsState.report.errors
                    });
                    break;
            }
        }

    }

    renderSummaryRoomDiagnostics() {
        return null;
    }

    clearReport() {
        const { roomId } = this.props;

        RoomConfigManager.getConfigManager(roomId).setThingState('room_diagnostics', {
            'clear_report': roomId
        }, true);
    }

    runDiagnostics() {
        const { roomId } = this.props;

        RoomConfigManager.getConfigManager(roomId).setThingState('room_diagnostics', {
            'start_diagnostics': roomId
        }, true);
    }

    renderActionButton() {
        const { status } = this.state;

        var actionButton = null;

        switch (status) {
            case 0:
            case 3:
                /* diagnostics completed, button to clear report */
                actionButton = <div className={ 'float-right container' } style={ styles.buttonContainer } onClick={ this.clearReport.bind(this) }>
                    <button style={styles.button}>
                        Clear Report
                    </button>
                </div>
                break;
            case 1:
                /* diagnostics idle ready to run, button to run */
                actionButton = <div className={ 'float-right container' } style={ styles.buttonContainer } onClick={ this.runDiagnostics.bind(this) }>
                    <button style={styles.button}>
                        Run Diagnostics
                    </button>
                </div>
                break;
            case 2:
                /* diagnostics running, disabled button */
                actionButton = <div className={ 'float-right container' } style={ styles.buttonContainer }>
                    <button style={styles.button} disabled={true}>
                        Running...
                    </button>
                </div>
                break;
        }

        return actionButton;
    }

    renderRoomReport() {
        const { status, errors } = this.state;
        var _loader = require('../../assets/dashboard_images/loader.gif');

        var report = null;

        switch (status) {
            case 0:
                /* ok, all checks successful */
                report = <div style={ styles.diagnosticsReportContainer }>
                    <span style={ styles.reportHeading }>All checks completed successfully. The Room is ready to welcome a new guest.</span>
                </div>
                break;
            case 1:
                /* idle, ready to run */
                report = <div style={ styles.diagnosticsReportContainer }>
                    <span style={ styles.reportHeading }>Ready to perform Room Diagnostics.</span>
                </div>
                break;
            case 2:
                /* diagnostics running */
                report = <div style={ styles.diagnosticsReportContainer }>
                    <span style={ styles.reportHeading }>Currently running Room Diagnostics...</span>
                    <div style={ styles.loaderContainer }>
                        <img src={ _loader } />
                    </div>
                </div>
                break;
            case 3:
                /* diagnostics found an error */
                report = <div style={ styles.diagnosticsReportContainer }>
                    <span style={ styles.reportHeading }>We found the following <span style={{ color: Styles.Colors.red }}>problems</span> in the room:</span>
                    <div style={ styles.errorsContainer }>{ errors.map((e, i) => <div style={ styles.errorText } key={'error-'+i}>{ e.error }</div> ) }</div>
                </div>
                break;
        }
        return report;
    }

    renderRoomDiagnostics() {
        const { status } = this.state;

        return (
            <div style={ styles.roomDiagnosticsContainer }>
                { this.renderActionButton() }
                { this.renderRoomReport() }
            </div>
        );
    }

    render() {
        const { isSummary } = this.props;

        return (
            <div>
                { isSummary ? this.renderSummaryRoomDiagnostics() : this.renderRoomDiagnostics() }
            </div>
        );
    }

}

const styles = {
    roomDiagnosticsContainer: {
        paddingTop: 40
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 207,
        height: 35,
        borderRadius: 3,
        backgroundColor: Styles.Colors.background_run_diagnostics_button,
        padding: 0,
    },
    button: {
        background: 'none',
        color: Styles.Colors.blue,
        height: 35,
        fontSize: 18,
        fontWeight: 500,
        borderRadius: 3,
        border: 'none'
    },
    diagnosticsReportContainer: {
        paddingTop: 75 /* 40 + 35 (height of action button) */
    },
    reportHeading: {
        fontSize: 26,
        fontWeight: 500,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: Styles.Colors.white,
    },
    loaderContainer: {
        paddingTop: 40,
        paddingLeft: 150,
    },
    errorText: {
        color: Styles.Colors.white,
        fontSize: 26,
        fontWeight: 'lighter',
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
    },
    errorsContainer: {
        paddingTop: 40
    }
};
