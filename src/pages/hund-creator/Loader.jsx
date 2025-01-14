import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="loading loading-ring loading-lg"></span>
      <h2>Uploading to IPFS...</h2>
    </div>
  );
}

export default Loader;