import React from 'react';

import NiceButton from './NiceButton';
import DataManager from './DataManager';
import RepositoryEditor from './RepositoryEditor';
import FileEditor from './FileEditor';
import DeploymentManager from './DeploymentManager';
import AddConfigForm from './AddConfigForm';
import DeploymentForm from './DeploymentForm';
import RunningDeploymentStatus from './RunningDeploymentStatus';

const SELECTED_TYPES = {
    NONE: -1,
    REPO: 0,
    FILE: 1,
    ADD_REPO: 2,
    ADD_FILE: 3,
};

export default class ConfigEditor extends React.Component {
    _deregister = undefined;

    static defaultProps = {
        runningDeployments: [],
    }

    state = {
        isAddingConfig: false,
        selectedRunningDeploymentId: -1,
        selectedConfigId: -1,
        selectedVersion: -1,
        selectedType: -1, // SELECTED_TYPES
        selectedIndex: -1,
    };

    componentWillMount() {
        this._deregister = DataManager.registerListener(this.onDataChanged.bind(this));
        this.onDataChanged();
    }

    componentWillUnmount() {
        if (this._deregister) {
            this._deregister();
            this._deregister = undefined;
        }
    }

    onDataChanged() {
        this.forceUpdate();
    }

    filterConfigChildren(configChildren) {
        var dict = {};
        for (var i = 0; i < configChildren.length; i++) {
            if (!(configChildren[i].name in dict) || dict[configChildren[i].name].version < configChildren[i].version)
                dict[configChildren[i].name] = configChildren[i];
        }
        return Object.values(dict);
    }

    renderSidebarConfigItems(config, indent=0, isLatest=true) {
        if (config.length == 0)
            return null;

        const { selectedConfigId } = this.state;

        var allVersions = DataManager.getConfigsByName(config.name);
        var allChildren = [];
        for (var i = 0; i < allVersions.length; i++)
            allChildren = allChildren.concat(DataManager.getConfigChildren(allVersions[i]));
        allChildren = this.filterConfigChildren(allChildren);

        return (
            <div key={'sidebar-item-'+config.id} style={{marginLeft: indent}}>
                <NiceButton
                        extraStyle={{marginTop: 5, textAlign: 'left', paddingLeft: 5, borderTop: '', borderRight: '', borderLeft: '', backgroundColor: '', color: isLatest? 'white' : 'gray'}}
                        isHighlighted={selectedConfigId == config.id}
                        onClick={() => this.setState({selectedConfigId: config.id, selectedVersion: config.version, selectedType: SELECTED_TYPES.NONE, isAddingConfig: false, selectedRunningDeploymentId: -1})}>
                    {"• " + config.name + " (v" + (config.version) + ")" + (isLatest ? "" : " (OLD)")}
                </NiceButton>
                {allChildren.map(c => this.renderSidebarConfigItems(c, 20, c.parent == config.id))}
            </div>
        );
    }

    trimFilename(filename) {
        var i = filename.lastIndexOf('/');
        if (i > 0)
            return filename.substr(i+1);
        return filename;
    }

    renderRunningDeployment() {
        const { selectedRunningDeploymentId } = this.state;
        const { runningDeployments } = this.props;

        var selectedRunningDeployment = runningDeployments.filter((rd) => rd.id == selectedRunningDeploymentId);
        selectedRunningDeployment = selectedRunningDeployment.length > 0 ? selectedRunningDeployment[0] : null;

        return <RunningDeploymentStatus runningDeployment={selectedRunningDeployment} />
    }

    deleteRunningDeployment(rdID) {
        const { selectedRunningDeploymentId } = this.state;
        DataManager.deleteRunningDeployment(rdID);

        /* if we delete a running deployment that we are viewing reset state
         * so it does not render a running deployment that does not exist
         */
        if (selectedRunningDeploymentId == rdID) {
            this.setState({
                isAddingConfig: false,
                selectedRunningDeploymentId: -1,
                selectedConfigId: -1,
                selectedVersion: -1,
                selectedType: -1,
                selectedIndex: -1,
            });
        }
    }

    renderRunningDeploymentStatus(status) {
        var statusReturn = null;
        switch (status.toLowerCase()) {
            case 'running':
                statusReturn = <span>RUNNING</span>
                break;
            case 'error':
                statusReturn = <span style={{ color: 'red' }}>ERROR</span>
                break;
            case 'completed':
                statusReturn = <span style={{ color: 'green' }}>COMPLETED</span>
                break;
            default:
                statusReturn = <span>{ status }</span>
        }
        return statusReturn
    }

    getDeploymentsForAllConfigVersions(allVersions) {
        var configDict = {};
        var configDeployments = {};
        var deployments = {};
        for (var i = 0; i < allVersions.length; i++) {
            configDict[allVersions[i].id] = allVersions[i];
            configDeployments[allVersions[i].id] = DataManager.getConfigDeployments(allVersions[i]);
            for (var j = 0; j < configDeployments[allVersions[i].id].length; j++) {
                var dep = configDeployments[allVersions[i].id][j];
                if (dep.target in deployments)
                    deployments[dep.target].push(dep);
                else
                    deployments[dep.target] = [dep];
            }
        }
        for (var k in deployments)
            deployments[k] = deployments[k].sort((a, b) => new Date(b.date) - new Date(a.date));

        return {deployments: deployments, configDict: configDict};
    }

    renderContent() {
        const { selectedRunningDeploymentId, selectedConfigId, selectedVersion, selectedIndex, selectedType } = this.state;

        if (selectedConfigId == -1 && selectedRunningDeploymentId == -1)
            return null;

        if (selectedRunningDeploymentId != -1)
            return this.renderRunningDeployment()

        var config = DataManager.getConfigById(selectedConfigId);
        var allVersions = DataManager.getConfigsByName(config.name);
        for (var i = 0; i < allVersions.length; i++)
            if (allVersions[i].version == selectedVersion)
                config = allVersions[i];
        var latestVersion = allVersions.map(c => c.version).reduce((a, b) => Math.max(a, b));
        var latestConfig = allVersions.filter(c => c.version == latestVersion)[0];

        var allRepositories = DataManager.getConfigRepositories(config, true);
        var myRepositories = DataManager.getConfigRepositories(config).map(r => r.id);
        var repositoryList = allRepositories.map(repo =>
            <NiceButton
                    key={'repo-'+repo.id}
                    extraStyle={myRepositories.filter(r => r == repo.id).length > 0 ? {} : {color: '#3467bb'}}
                    isHighlighted={selectedType == SELECTED_TYPES.REPO && selectedIndex == repo.id}
                    onClick={() => this.setState({selectedIndex: repo.id, selectedType: SELECTED_TYPES.REPO})}>
                {this.trimFilename(DataManager.getRepoById(repo.repo).local_path)}
            </NiceButton>
        );

        var allFiles = DataManager.getConfigFiles(config, true);
        var myFiles = DataManager.getConfigFiles(config).map(r => r.id);
        var fileList = allFiles.map(file =>
            <NiceButton
                    key={'file-'+file.id}
                    extraStyle={myFiles.filter(r => r == file.id).length > 0 ? {} : {color: '#3467bb'}}
                    isHighlighted={selectedType == SELECTED_TYPES.FILE && selectedIndex == file.id}
                    onClick={() => this.setState({selectedIndex: file.id, selectedType: SELECTED_TYPES.FILE})}>
                {this.trimFilename(file.target_filename)}
            </NiceButton>
        );

        var isEditable = DataManager.isDeploymentConfigEditable(config);
        var isLatestConfigEditable = DataManager.isDeploymentConfigEditable(latestConfig);
        var content = null;
        switch (selectedType) {
            case SELECTED_TYPES.REPO:
                content = <RepositoryEditor
                            key={'re-'+selectedIndex}
                            config={config}
                            repo={DataManager.getDeploymentRepoById(selectedIndex)}
                            isEditable={isEditable} />
                break;
            case SELECTED_TYPES.FILE:
                content = <FileEditor
                            key={'fe-'+selectedIndex}
                            config={config}
                            file={DataManager.getDeploymentFileById(selectedIndex)}
                            isEditable={isEditable} />
                break;
            case SELECTED_TYPES.ADD_REPO:
                content = <RepositoryEditor
                            key={'re-add'}
                            config={config}
                            isEditable={true} />
                break;
            case SELECTED_TYPES.ADD_FILE:
                content = <FileEditor
                            key={'fe-add'}
                            config={config}
                            isEditable={true} />
                break;
        }

        var addRepoButton = null;
        var addFileButton = null;
        var deleteButton = null;
        var updateButton = null;
        if (isEditable) {
            addRepoButton = (
                <NiceButton
                        isHighlighted={selectedType == SELECTED_TYPES.ADD_REPO}
                        onClick={() => this.setState({selectedType: SELECTED_TYPES.ADD_REPO})} >
                    + Add
                </NiceButton>
            );
            addFileButton = (
                <NiceButton
                        isHighlighted={selectedType == SELECTED_TYPES.ADD_FILE}
                        onClick={() => this.setState({selectedType: SELECTED_TYPES.ADD_FILE})} >
                        + Add
                </NiceButton>
            );
            deleteButton = (
                <NiceButton
                        extraStyle={{width: 100, float: 'right'}}
                        onClick={(() => {this.setState({selectedConfigId: -1}); DataManager.deleteConfig(config)}).bind(this)} >
                    Delete
                </NiceButton>
            );
            updateButton = (
                <NiceButton
                        extraStyle={{width: 200, float: 'right'}}
                        onClick={() => DataManager.updateParent(config)} >
                    Update Parent
                </NiceButton>
            );
        }

        var deploymentsForAllConfigVersions = this.getDeploymentsForAllConfigVersions(allVersions).deployments;
        var configDict = this.getDeploymentsForAllConfigVersions(allVersions).configDict;

        return (
            <React.Fragment>
                <div style={contentStyles.versionsContainer}>
                    {allVersions.map(configVersion =>
                        <NiceButton
                                key={"version-"+configVersion.version}
                                extraStyle={contentStyles.versionTab}
                                isHighlighted={configVersion.version == selectedVersion}
                                onClick={() => this.setState({selectedVersion: configVersion.version})}>
                            {"v"+configVersion.version}
                        </NiceButton>
                    )}
                    {isLatestConfigEditable ? null :
                        <NiceButton
                                onClick={() => this.setState({selectedVersion: DataManager.createNewVersion(config)})}
                                extraStyle={contentStyles.versionTab}>
                            +
                        </NiceButton>
                    }
                </div>
                <div style={contentStyles.contentContainer}>
                    <div style={contentStyles.sidebarContainer}>
                        <h4>Repositories</h4>
                        {repositoryList}
                        <br />
                        {addRepoButton}
                        <h4>Files</h4>
                        {fileList}
                        <br />
                        {addFileButton}
                    </div>
                    <div style={contentStyles.contentContentContainer}>
                        {content}
                    </div>
                </div>

                <br />
                {deleteButton}
                {updateButton}

                <br />

                <div style={contentStyles.deploymentFormContainer}>
                    <h3>New Deployment</h3>
                    <DeploymentForm config={config} previousConfigs={deploymentsForAllConfigVersions} />
                    <br />
                    <h3>Deployments</h3>
                    <DeploymentManager key={"dm-"+config.id} deployments={deploymentsForAllConfigVersions} configDict={configDict} />
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { isAddingConfig } = this.state;
        const { runningDeployments } = this.props;

        return (
            <React.Fragment>
                <div style={styles.container}>
                    <div style={styles.sidebarContainer}>
                        <div style={contentStyles.logoContainer}>
                            <img src={'/static/images/verboze.png'} height="30"/>
                            <div style={contentStyles.verbozeLogoText}>VERBOZE</div>
                        </div>
                        <div style={ styles.sidebarComponents }>
                            <h4>Configurations</h4>
                            {this.filterConfigChildren(DataManager.getConfigChildren()).map(c => this.renderSidebarConfigItems(c))}
                            <br />
                            <NiceButton
                                    isHighlighted={isAddingConfig}
                                    onClick={() => this.setState({isAddingConfig: true, selectedConfigId: -1, selectedRunningDeploymentId: -1})} >
                                + Add Config
                            </NiceButton>
                        </div>
                        <br />
                        <div style={ styles.sidebarComponents }>
                            <h4>Running Deployments</h4>
                            { runningDeployments.map((rd, i) => (
                                <div key={"rd-fragment-"+i} style={styles.runningDeploymentDiv}>
                                    <span style={{cursor: 'pointer'}} key={"rd-span"+i} onClick={() => this.deleteRunningDeployment(rd.deployment.id)}>
                                        <p>&#10005;&nbsp;</p>
                                    </span>
                                    <NiceButton
                                        key={"rd-" + i}
                                        onClick={() => this.setState({
                                            isAddingConfig: false,
                                            selectedRunningDeploymentId: rd.id,
                                            selectedConfigId: -1,
                                            selectedVersion: -1,
                                            selectedType: -1,
                                            selectedIndex: -1,
                                        })}
                                        extraStyle={{
                                            flex: 1,
                                            marginTop: 5,
                                            textAlign: 'left',
                                            paddingLeft: 5,
                                            borderTop: '',
                                            borderRight: '',
                                            borderLeft: '',
                                            backgroundColor: '',
                                            color: 'white'}}>
                                    { rd.deployment.target + " : " }
                                    { this.renderRunningDeploymentStatus(rd.status) }
                                </NiceButton>
                            </div>)) }
                        </div>
                    </div>
                    <div style={styles.contentContainer}>
                        {isAddingConfig ? <AddConfigForm /> : this.renderContent()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
    },
    sidebarContainer: {
        display: 'flex',
        flex: 2,
        flexDirection: 'column',
        maxWidth: 300,
        overflow: 'scroll',
        backgroundColor: '#111111'
    },
    contentContainer: {
        flex: 5,
        flexDirection: 'column',
        maxHeight: '100vh',
        overflow: 'scroll'
    },
    sidebarComponents: {
        flex: 1,
        maxHeight: 500,
        overflow: 'scroll'
    },
    runningDeploymentDiv: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
    }

};

const contentStyles = {
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        lineHeight: '42px',
        height: 38,
        padding: 5,
        borderBottom: '1px solid #ba3737',
    },
    verbozeLogoText: {
        fontSize: 30,
        marginLeft: 20,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    versionsContainer: {
        height: 49,
        display: 'flex',
        flexDirection: 'row',
    },
    versionTab: {
        flex: 1,
        lineHeight: '38px',
        margin: 0,
        padding: 0,
    },
    sidebarContainer: {
        padding: 5,
        display: 'flex',
        flex: 2,
        flexDirection: 'column',
        maxWidth: 300,
        overflow: 'scroll',
    },
    contentContentContainer: {
        padding: 5,
        display: 'flex',
        flex: 3,
        flexDirection: 'column',
    },
    deploymentFormContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },
};
