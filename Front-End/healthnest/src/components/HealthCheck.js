const HealthCheck = ({ name, description }) => {
    return (
      <div className="card m-4 p-3" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <a href="#" className="btn btn-primary">Learn more</a>
        </div>
      </div>
    );
  };
  
  export default HealthCheck;
  