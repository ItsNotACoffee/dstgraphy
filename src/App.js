import React from "react";
import GraphMenu from './components/Graphs/GraphMenu';
import Graph from "react-graph-vis";
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      branches: []
    };

    this.graph = {
      nodes: [
        { id: 1, label: "Node 1", title: "node 1 tootip text" },
        { id: 2, label: "Node 2", title: "node 2 tootip text" },
        { id: 3, label: "Node 3", title: "node 3 tootip text" },
        { id: 4, label: "Node 4", title: "node 4 tootip text" },
        { id: 5, label: "Node 5", title: "node 5 tootip text" }
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 5}
      ]
    };

    this.options = {
      clickToUse: false,
      layout: {
        hierarchical: {
          enabled: true,
          sortMethod: "directed"
        }
      },
      nodes: {
        color: {
          border: "#ffffff",
          highlight: {
            border: "#ffffff"
          }
        },
        fixed: true,
        physics: false
      },
      edges: {
        color: "#ffffff"
      },
      height: "500px"
    };

    this.commit = this.commit.bind(this);
    this.merge = this.merge.bind(this);
    this.addBranch = this.addBranch.bind(this);
    this.removeBranch = this.removeBranch.bind(this);
  }

  commit(branch, msg) {

  }

  merge(sBranch, dBranch) {

  }

  addBranch(bName) {

  }

  removeBranch(bName) {

  }

  render() {
    return (
      <div className="App">
        <h1 className="title">DSTGraphy</h1>
        <h4 className="desc">~Simulate and visualize Github operations~</h4>
        <div>
          <GraphMenu onBranch={this.addBranch} onCommit={this.commit}/>
        </div>
        <div className="mainGraph">
        <Graph graph={this.graph} options={this.options}/>
        </div>
      </div>
    );
  }
}

export default App;
