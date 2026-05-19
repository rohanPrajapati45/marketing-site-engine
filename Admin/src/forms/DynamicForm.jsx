import React from "react";

const DynamicForm = ({ schema, data, onChange }) => {
  if (!schema || schema.length === 0) return null;

  const handleFieldChange = (fieldName, value) => {
    onChange({ ...data, [fieldName]: value });
  };

  return (
    <div className="space-y-4">
      {schema.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              value={data[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          ) : field.type === "image" ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={data[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder="https://"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {data[field.name] && (
                <img
                  src={data[field.name]}
                  alt="preview"
                  className="h-10 w-10 object-cover rounded"
                />
              )}
            </div>
          ) : field.type === "select" ? (
            <select
              value={data[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">-- Select --</option>
              {(field.options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "number" ? "number" : "text"}
              value={data[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicForm;
