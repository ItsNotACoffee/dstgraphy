import React from  "react";
import "./GraphMenu.css";

class GraphMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            commitName: "",
            branchName: ""
        }

        this.setCommitName = this.setCommitName.bind(this);
        this.setBranchName = this.setBranchName.bind(this);
        this.passCommit = this.passCommit.bind(this);
        this.passBranch = this.passBranch.bind(this);
    }

    setCommitName(event) {
        this.setState({commitName: event.target.value});
    }
    setBranchName(event) {
        this.setState({branchname: event.target.value});
    }

    passCommit() {
        this.props.onCommit(this.state.commitName);
    }
    passBranch() {
        this.props.onBranch(this.state.branchName);
    }

    render() {
        return (
            <div className="graphMenu">
                <div>
                    <input placeholder="Commit name..." onChange={this.setCommitName}/>
                    <button onClick={this.passCommit}>Commit</button>
                </div>
                <div>
                    <input placeholder="Branch name..." onChange={this.setBranchName}/>
                    <button onClick={this.passBranch}>Branch</button>
                </div>
            </div>
        );
    }
}

export default GraphMenu;