import React from "react";

const TagsSection = ({ tags }) => (
  <div className="mt-4">
    <h3 className="text-xl font-semibold text-gray-800">Tags:</h3>
    <div className="flex flex-wrap mt-2">
      {tags.length > 0 ? (
        tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-200 text-blue-700 text-sm px-3 py-1 rounded-full mr-2 mb-2"
          >
            {tag}
          </span>
        ))
      ) : (
        <span className="text-gray-500">No tags available</span>
      )}
    </div>
  </div>
);

export default TagsSection;
