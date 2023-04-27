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
        drop:(event,{ draggable }) => {
          delete dragDropState.id;
          Array.from(document.querySelectorAll(".droppable")).forEach((droppable) => {
            droppable.classList.remove("drop-target");
          });
          const tasks = Array.from(me.state.tasks);
          const dropId = event.target.id;
          const taskId = draggable[0].id;
          const taskIndex = tasks.map((task,index) => {
            return {task,index};
          }).filter(({task}) => {
            return task.id === taskId;
          })[0].index;
          tasks[taskIndex].stage = dropId;
          me.updateState({ tasks });
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