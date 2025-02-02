import React from "react";

const DescriptionSection = ({ description }) => (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-gray-800">Description:</h3>
    <p className="text-gray-700 mt-2">{description}</p>
  </div>
);

export default DescriptionSection;
