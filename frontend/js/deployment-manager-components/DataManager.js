/* @flow */

import axios from 'axios';
import * as Cookies from 'js-cookie';

class DataManagerImpl {

    _listeners = {};
    _reloadTimout = undefined;

    serverData = {
        deploymentLocks: [],
        firmwares: [],
        repositories: [],
        repositoryBuildOptions: [],
        deploymentConfigs: [],
        deploymentFiles: [],
        fileDefaultParams: [],
        deploymentRepositories: [],
        deployments: [],
        deploymentParameters: [],
        deploymentBuildOptions: [],
    };

    fetchData(url, onData) {
        return new Promise((resolve, reject) => axios({
                method: 'GET',
                url: url,
            }).then(ret => {
                onData(ret.data);
                resolve(ret.data);
            }).catch(err => {
                console.log(err);
                reject(err);
                alert(err);
            })
        );
    }

    load() {
        var promises = [
            /* depend on remote deployment machine */
            this.fetchData('/deployment/running_deployment/', d => this.serverData.deploymentLocks = d),
            this.fetchData('/deployment/firmware/', d => this.serverData.firmwares = d),

            this.fetchData('/deployment/repository/', d => this.serverData.repositories = d),
            this.fetchData('/deployment/repository_build_option/', d => this.serverData.repositoryBuildOptions = d),

            /* configurations on server */
            this.fetchData('/deployment/deployment_config/', d => this.serverData.deploymentConfigs = d),
            this.fetchData('/deployment/deployment_file/', d => this.serverData.deploymentFiles = d),
            this.fetchData('/deployment/file_default_parameter/', d => this.serverData.fileDefaultParams = d),
            this.fetchData('/deployment/deployment_repository/', d => this.serverData.deploymentRepositories = d),
            this.fetchData('/deployment/deployment/', d => this.serverData.deployments = d),
            this.fetchData('/deployment/deployment_parameter/', d => this.serverData.deploymentParameters = d),
            this.fetchData('/deployment/deployment_build_option/', d => this.serverData.deploymentBuildOptions = d),
        ];
        Promise.all(promises).then((results => {
            Object.values(this._listeners).map(l => l()); // call all listeners
            // if (this.serverData.deploymentLocks.length > 0)
            //     this._reloadTimout = setTimeout(this.load.bind(this), 5000);
        }).bind(this));
    }

    registerListener(listener) {
        var lid = 1;
        while (lid in this._listeners) lid += 1;

        this._listeners[lid] = listener;
        return () => delete this._listeners[lid];
    }

    getRepoById(id) {
        return this.serverData.repositories.filter(repo => repo.id == id)[0];
    }

    getConfigById(id) {
        return this.serverData.deploymentConfigs.filter(cfg => cfg.id == id)[0];
    }

    getConfigsByName(name) {
        return this.serverData.deploymentConfigs.filter(cfg => cfg.name == name);
    }

    getAllFirmwares() {
        return this.serverData.firmwares;
    }

    getAllRepositories() {
        return this.serverData.repositories;
    }

    getAllConfigs() {
        return this.serverData.deploymentConfigs;
    }

    getConfigChildren(parent=null) {
        return this.serverData.deploymentConfigs.filter(cfg => cfg.parent == (parent ? parent.id : parent));
    }

    getDeploymentRepoById(id) {
        return this.serverData.deploymentRepositories.filter(repo => repo.id == id)[0];
    }

    getDeploymentFileById(id) {
        return this.serverData.deploymentFiles.filter(file => file.id == id)[0];
    }

    getDeploymentById(id) {
        return this.serverData.deployments.filter(dep => dep.id == id)[0];
    }

    getRepositoryBuildOptions(repoId) {
        return this.serverData.repositoryBuildOptions.filter(rbo => rbo.repo == repoId);
    }

    getConfigRepositories(config, traceInheritance=false) {
        var repos = this.serverData.deploymentRepositories.filter(repo => repo.deployment == config.id);
        if (traceInheritance && config.parent != null) {
            var ancestorRepos = this.getConfigRepositories(this.getConfigById(config.parent), true);
            for (var i = 0; i < ancestorRepos.length; i++) {
                if (repos.filter(r => r.repo == ancestorRepos[i].repo).length == 0)
                    repos.push(ancestorRepos[i]);
            }
        }
        return repos;
    }

    getConfigFiles(config, traceInheritance=false) {
        var files = this.serverData.deploymentFiles.filter(file => file.deployment == config.id);
        if (traceInheritance && config.parent != null) {
            var ancestorFiles = this.getConfigFiles(this.getConfigById(config.parent), true);
            for (var i = 0; i < ancestorFiles.length; i++) {
                if (files.filter(r => r.target_filename == ancestorFiles[i].target_filename).length == 0)
                    files.push(ancestorFiles[i]);
            }
        }
        return files;
    }

    getConfigFileParameters(file) {
        return this.serverData.fileDefaultParams.filter(fp => fp.file == file.id);
    }

    getConfigDeployments(config) {
        return this.serverData.deployments.filter(d => d.config == config.id);
    }

    getDeploymentParameters(deployment) {
        return this.serverData.deploymentParameters.filter(p => p.deployment == deployment.id);
    }

    getDeploymentBuildOptions(deployment) {
        return this.serverData.deploymentBuildOptions.filter(p => p.deployment == deployment.id);
    }

    isDeploymentConfigEditable(config) {
        // deployment is editable if neither it nor any of its children are deployed
        // and it is the latest version
        if (this.getConfigDeployments(config).length > 0)
            return false;
        if (config.version !== this.getConfigsByName(config.name).map(c => c.version).reduce((a, b) => Math.max(a, b)))
            return false;

        // get fucked
        return [true].concat(this.getConfigChildren(config).map(c => this.isDeploymentConfigEditable(c))).reduce((a,b) => a && b);
    }

    _apiCall(method, url, data, cb, errcb) {
        var csrftoken = Cookies.get('csrftoken');
        axios({
            method: method,
            url: url,
            data: data,
            headers: {'X-CSRFToken': csrftoken}
        }).then(ret => {
            console.log(ret.data);
            if (cb)
                cb(ret.data);
            this.load();
        }).catch(err => {
            console.log(err);
            if (errcb)
                errcb(err);
            alert(JSON.stringify(err.response.data));
        });
    }

    getRemoteDeploymentMachines(on_success) {
        this._apiCall('GET', '/deployment/remote_deployment_machine/', {}, on_success)
    }

    addConfig(name, parentId) {
        var isParentFound = false;
        for (var i = 0; i < this.serverData.deploymentConfigs.length; i++)
            if (this.serverData.deploymentConfigs[i].id == parentId)
                isParentFound = true;
        if (!isParentFound)
            parentId = null;

        this._apiCall('POST', '/deployment/deployment_config/', {name, parent: parentId});
    }

    deleteConfig(config) {
        this._apiCall('DELETE', '/deployment/deployment_config/'+config.id+'/');
    }

    updateParameters(file, parameters) {
        var fileParams = this.getConfigFileParameters(file);
        for (var param_name in parameters) {
            var existingParam = null;
            for (var j = 0; j < fileParams.length; j++)
                if (param_name == fileParams[j].parameter_name)
                    existingParam = fileParams[j];
            if (existingParam) {
                console.log(existingParam)
                this._apiCall('PATCH', '/deployment/file_default_parameter/'+existingParam.id+'/', {
                    parameter_name: param_name,
                    parameter_value: parameters[param_name].value,
                    is_required: parameters[param_name].required,
                });
            } else {
                this._apiCall('POST', '/deployment/file_default_parameter/', {
                    file: file.id,
                    parameter_name: param_name,
                    parameter_value: parameters[param_name].value,
                    is_required: parameters[param_name].required,
                });
            }
        }

        // remove parameters that don't exist anymore
        for (var i in fileParams) {
            var savedParam = fileParams[i];
            if (!(savedParam.parameter_name in parameters)) {
                this._apiCall('DELETE', '/deployment/file_default_parameter/'+savedParam.id+'/', {});
            }
        }
    }

    updateDeploymentFile(file, targetFilename, executable, content, parameters) {
        this._apiCall('PATCH', '/deployment/deployment_file/'+file.id+'/', {
            target_filename: targetFilename,
            is_executable: executable,
            file_contents: content,
        });
        this.updateParameters(file, parameters);
    }

    createDeploymentFile(config, targetFilename, executable, content, parameters) {
        this._apiCall('POST', '/deployment/deployment_file/', {
            deployment: config.id,
            target_filename: targetFilename,
            is_executable: executable,
            file_contents: content,
        }, d => this.updateParameters({id: d.id}, parameters));
    }

    deleteDeploymentFile(file) {
        this._apiCall('DELETE', '/deployment/deployment_file/'+file.id+'/');
    }

    updateDeploymentRepository(repo, repository, commit) {
        this._apiCall('PATCH', '/deployment/deployment_repository/'+repo.id+'/', {
            repo: repository,
            commit: commit,
        });
    }

    createDeploymentRepository(config, repository, commit) {
        this._apiCall('POST', '/deployment/deployment_repository/', {
            deployment: config.id,
            repo: repository,
            commit: commit,
        });
    }

    deleteDeploymentRepository(repo) {
        this._apiCall('DELETE', '/deployment/deployment_repository/'+repo.id+'/');
    }

    deploy(config, deploymentTargetId, firmwareId, targetName, comment, params, optionIds, disabledRepoIds) {
        this._apiCall('POST', '/deployment/deployment/deploy/', {
            config: config.id,
            firmwareId,
            targetName,
            comment,
            params,
            optionIds,
            deploymentTargetId,
            disabledRepoIds,
        });
    }

    deleteLock(lock) {
        clearTimeout(this._reloadTimout);
        this._apiCall('DELETE', '/deployment/running_deployment/'+lock.id+'/');
    }

    deleteRunningDeployment(rdId) {
        this._apiCall('DELETE', '/deployment/running_deployment/' + rdId + '/');
    }

    createNewVersion(config) {
        // first find all different versions of that config
        var allConfigs = this.getConfigsByName(config.name);
        var latestVersion = allConfigs.map(c => c.version).reduce((a, b) => Math.max(a, b));
        var latestConfig = allConfigs.filter(c => c.version == latestVersion)[0];
        var newVersion = latestVersion + 1;
        this._apiCall('POST', '/deployment/deployment_config/'+latestConfig.id+'/new_version/', {});
        return newVersion;
    }

    updateParent(config) {
        this._apiCall('POST', '/deployment/deployment_config/'+config.id+'/update_parent/', {});
    }
};

const DataManager = new DataManagerImpl();

export default DataManager;
