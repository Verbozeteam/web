import React from 'react';
import DataManager from './DataManager';
import NiceButton from './NiceButton';

export default class DeploymentForm extends React.Component {
    state = {
        burnFirmware: false,
        firmware: 1,
        comment: "",
        targetName: "",
        params: [],
        options: {},

        diskPath: "",
        disksList: [],

        rdmsList: [],
        rdm: "",
        deploymentTargetId: "",

        disabledRepoIds: [],

        previousConfigs: [],
    };

    refreshRDMs() {
        DataManager.getRemoteDeploymentMachines(rdms => this.setState({rdmsList: rdms, rdm: "" }));
    }

    resetState(config, previousConfigs) {
        var _params = DataManager.getConfigFiles(config, true).map(f => DataManager.getConfigFileParameters(f));
        var params = [];
        for (var i = 0; i < _params.length; i++)
            params = params.concat(_params[i]);

        var repositories = DataManager.getConfigRepositories(config, true);
        var buildOptions = [];
        for (var i = 0; i < repositories.length; i++)
            buildOptions = buildOptions.concat(DataManager.getRepositoryBuildOptions(repositories[i].repo));
        var boDict = {};
        for (var i = 0; i < buildOptions.length; i++)
            boDict[buildOptions[i].option_name] = {...buildOptions[i], isChecked: false};

        var allFirmwares = DataManager.getAllFirmwares()

        this.setState({
            burnFirmware: false,
            firmware: allFirmwares.length > 0 ? allFirmwares[0].id : [],
            targetName: "",
            comment: "",
            params: params,
            options: boDict,
            diskPath: "",
            disabledRepoIds: [],
            previousConfigs: previousConfigs,
            rdm: "",

        })
    }

    componentWillMount() {
        this.resetState(this.props.config, this.props.previousConfigs);
        this.refreshRDMs();
    }

    componentWillReceiveProps(nextProps) {
        this.resetState(nextProps.config, nextProps.previousConfigs);
    }

    deploy() {
        const { config } = this.props;
        const { firmware, targetName, comment, params, burnFirmware, options, rdmsList, deploymentTargetId, disabledRepoIds } = this.state;

        if (targetName.trim() == "" || deploymentTargetId.trim() == "") {
            alert("Missing 'Target Name' or 'Target Deployment'");
            return;
        }

        for (var i = 0; i < params.length; i++) {
            if (params[i].parameter_value.trim() == "" && params[i].is_required) {
                alert("Missing parameter '" + params[i].parameter_name + "'");
                return;
            }
        }

        var optionIds = Object.values(options).filter(o => o.isChecked).map(o => o.id);
        DataManager.deploy(config, deploymentTargetId, burnFirmware ? firmware : -1, targetName, comment, params, optionIds, disabledRepoIds);
        this.resetState(this.props.config, this.props.previousConfigs);
    }

    prefillFields(prevConfig) {
        const { params, options } = this.state;

        /* empty obj meaning selected blank option */
        if (JSON.stringify(prevConfig) === JSON.stringify({})) {

            /* clearing out parameter values */
            for (var i = 0; i < params.length; i++) {
                params[i].parameter_value = "";
            }

            for (var key in options) {
                options[key].isChecked = false;
            }

            this.setState({
                comment: "",
                targetName: "",
                params: params,
                options: options,
            });
        }
        else {
            var prefillParameters = DataManager.getDeploymentParameters(prevConfig);
            var prefillBuildOptions = DataManager.getDeploymentBuildOptions(prevConfig);

            /* prefilling parameters */
            for (var i = 0; i < params.length; i++) {
                var prefilled = false;
                for (var j = 0; j < prefillParameters.length; j++) {
                    if (prefillParameters[j].parameter_name == params[i].parameter_name) {
                        params[i].parameter_value = prefillParameters[j].parameter_value;
                        prefilled = true;
                    }
                }
                if (!prefilled) {
                    params[i].parameter_value = "";
                }
            }

            /* prefilling options */
            for (var key in options) {
                var prefilled = false;
                for (var i = 0; i < prefillBuildOptions.length; i++) {
                    if (prefillBuildOptions[i].option_name == key) {
                        options[key].isChecked = true
                        prefilled = true;
                    }
                }
                if (!prefilled) {
                    options[key].isChecked = false;
                }
            }

            this.setState({
                comment: prevConfig.comment,
                targetName: prevConfig.target,
                params: params,
                options: options
            });
        }
    }

    render() {
        const { config } = this.props;
        const {
            firmware, targetName, comment, params,
            burnFirmware, options, diskPath, disksList,
            rdmsList, rdm, disabledRepoIds, previousConfigs } = this.state;

        var firmwareList = DataManager.getAllFirmwares().map(f => <option key={'opf-'+f.id} value={f.id}>{f.name}</option>);
        var diskList = disksList.concat("").map(d => <option key={'opd-'+d} value={d}>{d}</option>);
        var depRepos = DataManager.getConfigRepositories(config, true);

        var rdmsOptionsList = [""].concat(rdmsList).map(_rdm => <option key={'rdm-'+_rdm.id} value={JSON.stringify(_rdm)}>{_rdm.name}</option>);
        var targetOptionsList = rdm ? [""].concat(rdm.targets).map(target => <option disabled={target !== "" && target.status.toLowerCase() !== 'ready'} key={'dt-'+target.id} value={target.id}>{target.identifier}</option>) : [];

        /* first option empty */
        var previousConfigsList = [<option key={'prev-deply-'} value={JSON.stringify({})}></option>];
        for (var k in previousConfigs) {
            for (var i = 0; i < previousConfigs[k].length; i++) {
                var listElem = <option key={'prev-deply-'+k+i} value={JSON.stringify(previousConfigs[k][i])}>{k} {previousConfigs[k].length > 1 ? "(" + (i + 1) + ")"  : null}</option>;
                previousConfigsList.push(listElem);
            }
        }

        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Remote Deployment Machine</div>
                    <div style={styles.fieldValue}>
                        <NiceButton extraStyle={{width: 200, float: "right"}} onClick={this.refreshRDMs.bind(this)}>Refresh</NiceButton>
                        <select onChange={e => {
                            this.setState({rdm: JSON.parse(e.target.value)});
                        } }>{rdmsOptionsList}</select>
                    </div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Deployment Target</div>
                    <div style={styles.fieldValue}>
                        <select onChange={e => this.setState({deploymentTargetId: e.target.value})}>{targetOptionsList}</select>
                    </div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Firmware</div>
                    <div style={styles.fieldValue}>
                        <input type={"checkbox"} checked={burnFirmware} onChange={e => this.setState({burnFirmware: e.target.checked})} />
                        <select onChange={e => this.setState({firmware: e.target.value})}>{firmwareList}</select>
                    </div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Pre-Fill From Previous Config</div>
                    <div style={styles.fieldValue}>
                        <select onChange={e => this.prefillFields(JSON.parse(e.target.value))}>{previousConfigsList}</select>
                    </div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Target Name</div>
                    <input style={styles.fieldValue} value={targetName} onChange={e => this.setState({targetName: e.target.value})} />
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Comment</div>
                    <textarea style={styles.fieldValue} value={comment} onChange={e => this.setState({comment: e.target.value})} rows={4} />
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Repositories to clone</div>
                    <div style={styles.fieldValue}></div>
                </div>
                {depRepos.map(repo =>
                    <div key={'rbo-'+repo.id} style={styles.row}>
                        <div style={styles.fieldName}>{((rp) => rp.slice(rp.slice(0, rp.length-2).lastIndexOf('/')))(DataManager.getRepoById(repo.repo).remote_path)}</div>
                        <input style={styles.fieldValue} type={"checkbox"} checked={disabledRepoIds.indexOf(repo.id) == -1} onChange={e => this.setState({disabledRepoIds: e.target.checked ? disabledRepoIds.filter(rid => rid != repo.id) : disabledRepoIds.concat(repo.id)})} />
                    </div>
                )}
                <div style={styles.row}>
                    <div style={styles.fieldName}>Build options:</div>
                    <div style={styles.fieldValue}></div>
                </div>
                {Object.keys(options).map(option_name =>
                    <div key={'bo-'+option_name} style={styles.row}>
                        <div style={styles.fieldName}>{option_name}</div>
                        <input style={styles.fieldValue} type={"checkbox"} checked={options[option_name].isChecked} onChange={e => this.setState({options: {...options, [option_name]: {...options[option_name], isChecked: e.target.checked}}})} />
                    </div>
                )}
                <div style={styles.row}>
                    <div style={styles.fieldName}>Parameters:</div>
                    <div style={styles.fieldValue}></div>
                </div>
                {params.map((p, i) =>
                    <div key={'dep-param-'+p.parameter_name+i} style={styles.row}>
                        <div style={styles.fieldName}>{p.parameter_name + " (" + (p.is_required? "required" : "not required") + ")"}</div>
                        <input style={styles.fieldValue} value={p.parameter_value} onChange={(e => {
                            params[i].parameter_value = e.target.value;
                            this.setState({params});
                        }).bind(this)} />
                    </div>
                )}
                <div style={styles.row}>
                    <div style={styles.fieldName}></div>
                    <div style={styles.fieldValue}>
                        <NiceButton
                                onClick={this.deploy.bind(this)} >
                            Deploy
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

