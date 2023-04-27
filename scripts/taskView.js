namespace('idiosynced.TaskView',{

}, ({  }) => {
  const leadingZero = function(num,count) {
    let str = "" + num;
    return "0".repeat(count - str.length) + str;
  }
  const newId = function(){
    const now = new Date();
    return [
      ["getFullYear",0,4],
      ["getMonth",1,2],
      ["getDate",0,2],
      ["getHours",0,2],
      ["getMinutes",0,2],
      ["getSeconds",0,2],
      ["getMilliseconds",0,3],
    ].map(([fn,add,zeros]) => {
      return leadingZero( now[fn]() + add, zeros );
    }).join("");
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.onClose = props.onClose;
      props.setOnOpen(({task,index}) => {
        if (task) {
          this.setState({task, index});
        } else {
          this.setState({
            index:-1,
            task:{
              id:newId(),
              stage:"backlog",
              title:"",
              description:""
            }
          });
        }
      });
    }
    update(field,value){
      const task = this.state.task;
      task[field] = value;
      this.setState({ task });
    }
    render() {
      return <>
        <h3>Edit Task</h3>
        <div className="input-group mb-3">
          <span className="input-group-text" id="title">Title</span>
          <input type="text" className="form-control" value={this.state.task?.title || ""} onChange={(e) => this.update('title',e.target.value)}/>
        </div>
        <div className="input-group">
          <span className="input-group-text">Description</span>
          <textarea className="form-control" value={this.state.task?.description || ""} onChange={(e) => this.update('description',e.target.value)}></textarea>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => this.onClose(this.state)}>Confirm</button>
          <button className="btn btn-secondary" onClick={() => this.onClose()}>Cancel</button>
        </div>
      </>;
    }
  }
});