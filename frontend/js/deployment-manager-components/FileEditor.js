import React from 'react';
import NiceButton from './NiceButton';
import DataManager from './DataManager';

export default class FileEditor extends React.Component {
    state = {
        targetFilename: "",
        executable: false,
        content: "",
        parameters: {},
    };

    componentWillMount() {
        this.resetParams();
    }

    resetParams() {
        if (this.props.file) {
            var params = DataManager.getConfigFileParameters(this.props.file);
            var paramsDict = {};
            for (var i = 0; i < params.length; i++)
                paramsDict[params[i].parameter_name] = {value: params[i].parameter_value, required: params[i].is_required};

            this.setState({
                targetFilename: this.props.file.target_filename,
                executable: this.props.file.is_executable,
                content: this.props.file.file_contents,
                parameters: paramsDict,
            });
        } else {
            this.setState({
                targetFilename: "",
                executable: false,
                content: "",
                parameters: {},
            });
        }
    }

    save() {
        const { targetFilename, executable, content, parameters } = this.state;
        const { file, config } = this.props;

        if (targetFilename.trim() == "")
            return;

        if (file && file.deployment == config.id)
            DataManager.updateDeploymentFile(file, targetFilename.trim(), executable, content, parameters);
        else
            DataManager.createDeploymentFile(config, targetFilename.trim(), executable, content, parameters);
    }

    delete() {
        const { file } = this.props;
        DataManager.deleteDeploymentFile(file);
    }

    updateParameters() {
        var defaultParams = [];
        if (this.props.file) {
            defaultParams = DataManager.getConfigFileParameters(this.props.file);
        }
        var defaultParamsDict = {};
        for (var i = 0; i < defaultParams.length; i++)
            defaultParamsDict[defaultParams[i].parameter_name] = {value: defaultParams[i].parameter_value, required: defaultParams[i].is_required};

        var matches = this.state.content.match(/{{(.+?)}}/g) || [];
        var paramNames = Array.from(new Set(matches.map(m => m.substr(2, m.length-4))));

        var oldParameters = JSON.parse(JSON.stringify(this.state.parameters));
        var oldParameterNames = Object.keys(oldParameters);
        for (var i = 0; i < oldParameterNames.length; i++) {
            var pname = oldParameterNames[i];
            if (paramNames.filter(n => pname == n).length == 0)
                delete oldParameters[pname];
        }
        for (var i = 0; i < paramNames.length; i++) {
            if (!(paramNames[i] in oldParameters)) {
                if (paramNames[i] in defaultParamsDict)
                    oldParameters[paramNames[i]] = defaultParamsDict[paramNames[i]];
                else
                    oldParameters[paramNames[i]] = {value: "", required: false};
            }
        }

        if (JSON.stringify(this.state.parameters) !== JSON.stringify(oldParameters))
            this.setState({parameters: oldParameters});
    }

    render() {
        const { targetFilename, executable, content, parameters } = this.state;
        const { file, config, isEditable } = this.props;

        var filenameView = null;
        var executableView = null;
        var contentView = null;
        var editButtons = null;
        var paramsView = null;

        if (isEditable) {
            filenameView = <input style={styles.fieldValue} value={targetFilename} onChange={e => this.setState({targetFilename: e.target.value})} />;
            executableView = <input type="checkbox" style={styles.fieldValue} checked={executable} onChange={e => this.setState({executable: e.target.checked})} />;
            contentView = <textarea style={styles.fieldValue} value={content} onChange={e => this.setState({content: e.target.value})} rows={35} />;

            var deleteButton = null;
            if (file && file.deployment == config.id) {
                deleteButton = (
                    <NiceButton extraStyle={{marginLeft: 20, width: 200}} onClick={this.delete.bind(this)}>
                        Delete
                    </NiceButton>
                );
            }

            editButtons = (
                <div style={{...styles.row, ...{justifyContent: 'center'}}}>
                    <NiceButton extraStyle={{width: 200}} onClick={this.save.bind(this)}>
                        Save
                    </NiceButton>
                    <NiceButton extraStyle={{marginLeft: 20, width: 200}} onClick={this.resetParams.bind(this)}>
                        Reset
                    </NiceButton>
                    {deleteButton}
                </div>
            );

            paramsView = [];
            for (var key in parameters) {
                const k = key;
                paramsView.push(
                    <div key={"param-"+k} style={styles.row}>
                        <div style={styles.fieldName}>{k}</div>
                        <div style={styles.fieldValue}>
                            <div>
                                <input id={"param-cb-"+k} value={parameters[k].value} onChange={e => this.setState({parameters: {...parameters, [k]: {value: e.target.value, required: parameters[k].required}}})} />
                            </div>
                            <div>
                                <input type={"checkbox"} checked={parameters[k].required} onChange={e => this.setState({parameters: {...parameters, [k]: {value: parameters[k].value, required: e.target.checked}}})} />
                                <label htmlFor={"param-cb-"+k}>Required?</label>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            filenameView = <div style={styles.fieldValue}>{targetFilename}</div>;
            executableView = <div style={styles.fieldValue}>{executable ? "Yes" : "No"}</div>;
            contentView = <textarea disabled style={styles.fieldValue} value={content} onChange={e => this.setState({content: e.target.value})} rows={35} />;

            paramsView = [];
            for (var key in parameters) {
                const k = key;
                paramsView.push(
                    <div key={"param-"+k} style={styles.row}>
                        <div style={styles.fieldName}>{k}</div>
                        <div style={styles.fieldValue}>{parameters[k].value+" ("+(parameters[k].required? "required" : "not required")+")"}</div>
                    </div>
                );
            }
        }

        requestAnimationFrame(this.updateParameters.bind(this));

        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <div style={styles.fieldName}>ID</div>
                    <div style={styles.fieldValue}>{file ? file.id : "New"}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Target Filename</div>
                    {filenameView}
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Executable?</div>
                    {executableView}
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Content</div>
                    {contentView}
                </div>
                {paramsView}
                {editButtons}
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
