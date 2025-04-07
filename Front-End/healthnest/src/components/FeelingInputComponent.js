import React from 'react';

const FeelingInputComponent = () => {
  
  return (
    <div style={{ margin: "250px" }}>
      <h2 className="text-2xl font-semibold text-center mb-4">Describe how you are feeling</h2>
      <div className="form-floating">
        <textarea
          className="form-control w-full h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          id="floatingTextarea"
          placeholder=""
        ></textarea>
        <label htmlFor="floatingTextarea"> </label>
      </div>

      <button
        className="text-white px-6 py-2 rounded"
        style={{
          backgroundColor: "#00008B",
          position: "absolute",
          right: "750px",
        }} 
      >
        Suggest me
      </button>
    </div>
  );
};

export default FeelingInputComponent;
