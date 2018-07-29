import React from 'react';
import DataManager from './DataManager';
import NiceButton from './NiceButton';

export default class RepositoryEditor extends React.Component {
    state = {
        repository: -1,
        commit: "",
    };

    componentWillMount() {
        this.resetParams();
    }

    resetParams() {
        if (this.props.repo) {
            this.setState({
                repository: this.props.repo.repo,
                commit: this.props.repo.commit
            });
        } else {
            this.setState({
                repository: DataManager.getAllRepositories()[0].id,
                commit: "master",
            });
        }
    }

    save() {
        const { commit, repository } = this.state;
        const { repo, config } = this.props;

        if (repo && repo.deployment == config.id)
            DataManager.updateDeploymentRepository(repo, repository, commit);
        else
            DataManager.createDeploymentRepository(config, repository, commit);
    }

    delete() {
        const { repo } = this.props;
        DataManager.deleteDeploymentRepository(repo);
    }

    render() {
        const { commit, repository } = this.state;
        const { repo, config, isEditable } = this.props;

        var commitView = null;
        var repoView = null;
        var editButtons = null;

        if (isEditable) {
            var allRepos = DataManager.getAllRepositories();
            var options = allRepos.map(r => <option key={"o-"+r.id} value={r.id}>{r.remote_path}</option>);
            repoView = (
                <select style={styles.fieldValue} value={repository} onChange={e => this.setState({repository: e.target.value})}>
                    {options}
                </select>
            )
            commitView = <input style={styles.fieldValue} value={commit} onChange={e => this.setState({commit: e.target.value})} />;

            var deleteButton = null;
            if (repo && repo.deployment == config.id) {
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
        } else {
            commitView = <div style={styles.fieldValue}>{commit}</div>;
            repoView = <div style={styles.fieldValue}>{DataManager.getRepoById(repo.repo).remote_path}</div>;
        }

        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <div style={styles.fieldName}>ID</div>
                    <div style={styles.fieldValue}>{repo ? repo.id : "New"}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Repository Remote</div>
                    {repoView}
                </div>
                <div style={styles.row}>
                    <div style={styles.fieldName}>Commit</div>
                    {commitView}
                </div>
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
