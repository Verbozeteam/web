import React from 'react';
import DataManager from './DataManager';
import NiceButton from './NiceButton';

export default class AddConfigForm extends React.Component {
    state = {
        name: "",
        parent: -1,
    };

    addConfig() {
        const { name, parent } = this.state;

        if (name.trim() == "")
            return;

        DataManager.addConfig(name.trim(), parent);
    }

    render() {
        const { name, parent } = this.state;

        var options = [<option key={"o--1"} value={-1}>None</option>];
        var allConfigs = DataManager.getAllConfigs();
        var latestConfigs = {};
        for (var i = 0; i < allConfigs.length; i++) {
            if (!(allConfigs[i].name in latestConfigs) || latestConfigs[allConfigs[i].name].version < allConfigs[i].version)
                latestConfigs[allConfigs[i].name] = allConfigs[i];
        }
        for (var k in latestConfigs) {
            options.push(<option key={"o-"+k} value={latestConfigs[k].id}>{latestConfigs[k].name+" (v"+latestConfigs[k].version+")"}</option>)
        }

        return (
            <div style={styles.container}>
                <h2>Add New Config</h2>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Parent Config</div>
                    <select style={styles.fieldValue} value={parent} onChange={e => this.setState({parent: e.target.value})}>
                        {options}
                    </select>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Config Name</div>
                    <input style={styles.fieldValue} value={name} onChange={e => this.setState({name: e.target.value})} />
                </div>

                <br />
                <div style={styles.row}>
                    <div style={styles.fieldName}></div>
                    <div style={styles.fieldValue}>
                        <NiceButton
                                onClick={this.addConfig.bind(this)} >
                            Add
                        </NiceButton>
                    </div>
                </div>
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
