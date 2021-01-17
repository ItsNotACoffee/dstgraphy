import React from  "react";
import update from 'immutability-helper';
import { withAlert } from 'react-alert'

class GraphMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            commitName: "",
            branchName: "",
            selectedBranch: "master", //selected branch
            selectedMerge: "", //selected branch to merge with
            branchList: [
                { value: "master", name: "master"}
            ],
            allBranchList: [ //used for tracking every branch added
                { value: "master", name: "master"}
            ]
        }

        this.setCommitName = this.setCommitName.bind(this);
        this.setBranchName = this.setBranchName.bind(this);
        this.setSelectedBranch = this.setSelectedBranch.bind(this);
        this.setSelectedMerge = this.setSelectedMerge.bind(this);

        this.passCommit = this.passCommit.bind(this);
        this.passBranch = this.passBranch.bind(this);
        this.passMerge = this.passMerge.bind(this);
        this.passTogglePhysics = this.passTogglePhysics.bind(this);
    }

    setCommitName(event) {
        this.setState({commitName: event.target.value});
    }
    setBranchName(event) {
        this.setState({branchName: event.target.value});
    }
    setSelectedBranch(event) {
        this.setState({selectedBranch: event.target.value});
    }
    setSelectedMerge(event) {
        this.setState({selectedMerge: event.target.value});
    }

    passCommit() {
        this.props.onCommit(this.state.selectedBranch, this.state.commitName);
    }
    passBranch() {
        if (this.state.branchName !== "") {
            var index = this.state.allBranchList.findIndex(element => element.value === this.state.branchName);
            if (index === -1) {
                var updatedBranchList = update(this.state.branchList, {$push: [{ value: this.state.branchName, name: this.state.branchName}]});
                this.setState({branchList: updatedBranchList});
                updatedBranchList = update(this.state.allBranchList, {$push: [{ value: this.state.branchName, name: this.state.branchName}]});
                this.setState({allBranchList: updatedBranchList});

                this.setState({selectedMerge: updatedBranchList[0].value}); //necessary to update the selection
                this.setState({selectedBranch: this.state.branchName});

                this.props.onBranch(this.state.branchName, this.state.selectedBranch);
            } else {
                this.props.alert.show('Name already used by another branch!');
            }
        } else {
            this.props.alert.show('Branch name cannot be empty!');
        }
    }
    passMerge() {
        if (this.state.selectedMerge !== "") {
            if (this.state.selectedMerge !== this.state.selectedBranch) {
                this.props.onMerge(this.state.selectedBranch, this.state.selectedMerge);

                var index = this.state.branchList.findIndex(element => element.value === this.state.selectedBranch);
                var updatedBranchList = update(this.state.branchList, {$splice: [[index, 1]]});
                this.setState({branchList: updatedBranchList});
                this.setState({selectedBranch: this.state.selectedMerge});
                if (updatedBranchList.length < 2) {
                    this.setState({selectedMerge: ""});
                } else {
                    this.setState({selectedMerge: updatedBranchList[0].value});
                }
            } else {
                this.props.alert.show('Cannot merge a branch with itself!');
            }
        } else {
            this.props.alert.show('No merge branch selected!');
        }
    }
    passTogglePhysics() {
        this.props.onTogglePhysics();
    }

    render() {
        return (
            <div className="graphMenu">
                <div>
                    <b>Current Branch: </b>
                    <select onChange={this.setSelectedBranch} value={this.state.selectedBranch}>
                        {this.state.branchList.map((e, key) => {
                            return <option key={e.value} value={e.value}>{e.name}</option>;
                        })}
                    </select>
                </div>
                <div>
                    <input className="input" placeholder="Branch name..." onChange={this.setBranchName}/>
                    <button className="button" onClick={this.passBranch}>Branch</button>
                </div>
                <div>
                    <input className="input" placeholder="Commit name..." onChange={this.setCommitName}/>
                    <button className="button" onClick={this.passCommit}>Commit</button>
                </div>
                <div>
                    <select onChange={this.setSelectedMerge} value={this.state.selectedMerge}>
                        {this.state.branchList.map((e, key) => {
                            if (this.state.branchList.length < 2) {
                                return ""
                            }
                            else return <option key={e.value} value={e.value}>{e.name}</option>;
                        })}
                    </select>
                    <button className="button" onClick={this.passMerge}>Merge</button>
                    <button className="button" onClick={this.passTogglePhysics}>Toggle Physics</button>
                </div>
            </div>
        );
    }
}

export default withAlert()(GraphMenu);