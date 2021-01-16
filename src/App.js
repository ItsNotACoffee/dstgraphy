import React from "react";
import GraphMenu from './components/Graphs/GraphMenu';
import Graph from "react-graph-vis";
import update from 'immutability-helper';
import { v4 as uuidv4 } from "uuid";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      branches: [{
        name: "master",
        nodes: [
          1
        ],
        colorIndex: 7,
        level: 1, //the level the node is at - used for fixing node levels manually
        lastNode: 1, //keeps track of the last node added
        initialNode: 1, //the starting point of the branch, can be a fork
        finalNode: 0 //the final node of the branch, used when merging
      }],
      graphData: {
        nodes: [
          { id: 1, label: "Initial Commit", title: "Initial Commit", level: 1 }
        ],
        edges: [] //{ from: 1, to: 2 }
      },
      nodeId: 1, //global counter for node ids
      colors: {
        index: 0,
        cList: ["#e53935", "#43a047", "#fdd835", "#fb8c00", "#6d4c41", "#5e35b1", "#d81b60", "#63ccff"]
      }
    };

    this.options = {
      clickToUse: false,
      layout: {
        improvedLayout: false,
        hierarchical: {
          enabled: true,
          sortMethod: "directed"
        }
      },
      nodes: {
        shape: "hexagon",
        color: {
          border: "#63ccff",
          background: "#63ccff",
          highlight: {
            border: "#ffffff"
          }
        },
        fixed: false,
        physics: true,
        font: {
          color: "#ffffff"
        }
      },
      edges: {
        color: "#ffffff",
        width: 3
      },
      interaction: {
        hover: true
      },
      height: "500px"
    };

    this.commit = this.commit.bind(this);
    this.merge = this.merge.bind(this);
    this.addBranch = this.addBranch.bind(this);
    this.removeBranch = this.removeBranch.bind(this);
  }

  commit(branchName, msg) {
    //update the nodeId tracker
    var currId = this.state.nodeId;
    var updatedNodeId = update(this.state.nodeId, {$set: currId + 1});
    this.setState({nodeId: updatedNodeId});

    //update branch properties
    var branch = this.state.branches.find(element => element.name === branchName);
    // eslint-disable-next-line
    var index = this.state.branches.findIndex(element => element.name === branchName);
    
    branch.nodes.push(updatedNodeId);
    var lastNode = branch.lastNode;
    branch.lastNode = updatedNodeId;
    var level = branch.level+1;
    branch.level = level;
    var updatedBranches = update(this.state.branches, {index: {$set: branch}});
    this.setState({branches: updatedBranches});
    console.log(level);

    //update graph properties
    var color = this.state.colors.cList[branch.colorIndex];
    var updatedData = update(this.state.graphData, {nodes: {$push: [{id: updatedNodeId, label: branch.name + " - " + msg, title: msg, color: color, level: level}]}});
    updatedData = update(updatedData, {edges: {$push: [{from: lastNode, to: updatedNodeId, color: color}]}});
    this.setState({graphData: updatedData});
  }

  merge(sBranch, dBranch) {
    //--make a merge commit first--
    //update the nodeId tracker
    var currId = this.state.nodeId;
    var updatedNodeId = update(this.state.nodeId, {$set: currId + 1});
    this.setState({nodeId: updatedNodeId});

    //fetch branches
    var destBranch = this.state.branches.find(element => element.name === dBranch);
    var sourceBranch = this.state.branches.find(element => element.name === sBranch);
    // eslint-disable-next-line
    var dIndex = this.state.branches.findIndex(element => element.name === dBranch);
    // eslint-disable-next-line
    var sIndex = this.state.branches.findIndex(element => element.name === sBranch);

    //update branch properties
    destBranch.nodes.push(updatedNodeId);
    var lastNode = destBranch.lastNode;
    destBranch.lastNode = updatedNodeId;
    sourceBranch.finalNode = updatedNodeId;

    var level = 0;
    if (sourceBranch.level > destBranch.level) {
      level = sourceBranch.level+1;
    } else if (destBranch.level > sourceBranch.level) {
      level = destBranch.level+1;
    } else { //equal
      level = destBranch.level+1;
    }
    destBranch.level = level;
    console.log(destBranch.level);

    var updatedBranches = update(this.state.branches, {dIndex: {$set: destBranch}});
    updatedBranches = update(updatedBranches, {sIndex: {$set: sourceBranch}});
    this.setState({branches: updatedBranches});

    

    //update graph properties
    var color = this.state.colors.cList[destBranch.colorIndex];
    var updatedData = update(this.state.graphData, {nodes: {$push: [{id: updatedNodeId, label: "Merge " + sBranch + " into " + dBranch, title: "Merge " + sBranch + " into " + dBranch, color: color, level: level}]}});
    updatedData = update(updatedData, {edges: {$push: [{from: lastNode, to: updatedNodeId, color: color}]}});
    color = this.state.colors.cList[sourceBranch.colorIndex];
    updatedData = update(updatedData, {edges: {$push: [{from: sourceBranch.lastNode, to: updatedNodeId, color: color}]}});
    this.setState({graphData: updatedData});
  }

  addBranch(bName, bCurrent) {
    var branch = this.state.branches.find(element => element.name === bCurrent);

    var colors = this.state.colors;
    var updatedBranches = update(this.state.branches, {$push: [{name: bName, nodes: [], colorIndex: colors.index, level: branch.level, lastNode: branch.lastNode, initialNode: branch.lastNode, finalNode: 0}]});
    this.setState({branches: updatedBranches});

    //update color index
    if (colors.index + 1 > 7) {
      colors.index = 0;
    } else {
      colors.index = colors.index + 1;
    }
    var updatedColors = update(this.state.colors, {$set: colors});
    this.setState({colors: updatedColors});
  }

  removeBranch(bName) {

  }

  render() {
    return (
      <div className="App">
        <h1 className="title">DSTGraphy</h1>
        <h4 className="desc">~Simulate and visualize Github operations~</h4>
        <div>
          <GraphMenu onBranch={this.addBranch} onCommit={this.commit} onMerge={this.merge} onPrint={this.print}/>
        </div>
        <div className="mainGraph">
        <Graph key={uuidv4} graph={this.state.graphData} options={this.options}/>
        </div>
      </div>
    );
  }
}

export default App;
