namespace('idiosynced.TaskBoard',{

}, ({  }) => {
  const columns = [{
    label: "Ready",
    stage: "ready",
    borderColor: "border-success"
  },{
    label: "In Progress",
    stage: "inProgress",
    borderColor: "border-warning"
  },{
    label: "Done",
    stage: "done",
    borderColor: "border-danger"
  }];
  const colorsByStage = columns.reduce((out, {stage, borderColor}) => {
    out[stage] = borderColor;
    return out;
  }, {});
  const cardClasses = "card bg-dark border border-5 rounded-3"
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tasks: props.tasks
      };
      this.updateState = props.updateState;
    }
    componentDidUpdate() {
      this.afterRender();
    }
    componentDidMount(){
      this.afterRender();
    }
    afterRender() {
      const me = this;
      const dragDropState = {};
      $(".droppable").droppable({
        over:(event, { helper }) => {
          const oldColor = colorsByStage[dragDropState.id];
          const newColor = colorsByStage[event.target.id];
          const classList = helper[0].classList;
          classList.remove(oldColor);
          classList.add(newColor);
        },
        out:(event) => {
          dragDropState.id = event.target.id;
        },
        drop:(event,{ draggable, position: { top } }) => {
          delete dragDropState.id;
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.remove("drop-target");
          });
          const tasks = Array.from(me.state.tasks);
          const dropId = event.target.id;
          const { columnTasks, idIndicies } = tasks.reduce(({ columnTasks, idIndicies }, task, index) => {
            idIndicies[task.id] = index;
            if (task.stage === dropId) {
              columnTasks.push(task.id);
            }
            return { columnTasks, idIndicies };
          }, {columnTasks:[], idIndicies:{}});
          const taskTops = columnTasks.map((taskId) => {
            return { 
              id: taskId, 
              index: idIndicies[taskId], 
              top: document.getElementById(taskId).clientTop
            };
          }).sort((a,b) => a.top - b.top);
          const newIndex = taskTops.filter((t) => t.top < top).length;
          const taskId = draggable[0].id;
          const taskIndex = idIndicies[taskId];
          taskTops.splice(newIndex, 0, { id: taskId, index: taskIndex, top });
          const columnIds = taskTops.reduce((out, { id }) => {
            out[id] = true;
            return out;
          }, {});
          const task = tasks[taskIndex];
          task.stage = dropId;
          const newTaskOrder = [].concat( taskTops.map(({index}) => tasks[index]), tasks.filter(({id}) => !columnIds[id]))
          me.updateState({ tasks: newTaskOrder });
        }
      });
      $(".draggable").draggable({ 
        helper: "clone",
        zIndex:100,
        start:(event, ui) => {
          const draggable = event.target;
          const helper = ui.helper[0];
          helper.style.width = draggable.clientWidth;
          helper.style.height = draggable.clientHeight;
        },
        drag:() => {
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.add("drop-target");
          });
        }
      });
    }
    clearStage(stage) {
      const tasks = Array.from(this.state.tasks);
      const activeTasks = tasks.filter((task) => task.stage !== stage);
      console.log({ stage, tasks, activeTasks });
      this.updateState({ tasks: activeTasks });
      this.setState({ tasks: activeTasks });
    }
    revertStage(from,to) {
      this.setState({ tasks: this.state.tasks.map((task) => {
        if (task.stage === from) {
          task.stage = to;
        }
        return task;
      })})
    }
    render() {
      return <div className="row h-100">
        { columns.map(({ label, stage, borderColor }) => {
          return <div className="col-4 h-100">
            <div id={stage} key={`stage-card-${stage}`} className={`${cardClasses} ${borderColor} droppable h-100`}>
              <div className="card-body h-100">
                <div className="d-flex">
                  <h2 className="flex-grow-1">{label}</h2>
                  { stage === 'ready' && <button className="btn btn-info" onClick={() => {
                    this.revertStage("ready","backlog");
                  }}>Revert</button> }
                  { stage === 'done' && <button className="btn btn-info" onClick={() => {
                    this.clearStage(stage);
                  }}>Clear</button>}
                </div>
                <div className="d-flex flex-column">
                  { this.state.tasks.filter((task) => task.stage === stage).map((task) => {
                    return <div id={ task.id } key={`task-card-${task.id}`} className={`${cardClasses} ${borderColor} draggable`}>
                      <div className="card-body">
                        <h3 className="card-title">{task.title}</h3>
                        <p className="card-text">{task.description}</p>
                        <button className="btn btn-info" onClick={() => props.viewTask({ task, index })}><i className="fas fa-pencil-alt"/></button>
                      </div>
                    </div>;
                  }) }
                </div>
                </div>      
            </div>      
          </div>;
        }) }
      </div>;
    }
  }
});