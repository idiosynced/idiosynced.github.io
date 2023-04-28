namespace('idiosynced.Backlog',{

}, ({  }) => {
  const cardClasses = "card bg-dark border border-5 rounded-3";
  const buildSetReady = function(props) {
    return function(index) {
      const tasks = props.tasks;
      tasks[index].stage = 'ready';
      props.updateState({ tasks });
    }
  }
  const buildDeleteTask = function(props) {
    return function(index) {
      const tasks = Array.from(props.tasks);
      tasks.splice(index,1);
      props.updateState({ tasks });
    }
  }
  return function(props) {
    const setReady = buildSetReady(props);
    const deleteTask = buildDeleteTask(props);
    return <div className="row h-100">
      <div className="col-12 h-100">
        <div className={`${cardClasses} border-light h-100`}>
          <div className="card-body h-100">
            <div className="d-flex flex-column h-100">
              <button className="btn btn-success" onClick={() => {
                props.viewTask({});
              }}>Add Task</button>
              { props.tasks.map(( task, index ) => { return { task, index }}).filter(({task}) => task.stage === 'backlog').map(({task,index}) => {
                return <div key={`task-card-${task.id}`} className={`${cardClasses} border-light`}>
                  <div className="card-body d-flex">
                    <span className="flex-grow-1"><strong>{task.title}</strong> - {task.description}</span>
                    <button className="btn btn-success" onClick={() => setReady(index)}><i className="fas fa-flag-checkered"/></button>
                    <button className="btn btn-info" onClick={() => props.viewTask({ task, index })}><i className="fas fa-pencil-alt"/></button>
                    <button className="btn btn-danger" onClick={() => deleteTask(index)}><i className="far fa-trash-alt"/></button>
                  </div>
                </div>;
              })  }
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
});