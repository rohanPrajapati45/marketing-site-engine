import React from 'react';

const DynamicForm = ({ schema, data, onChange }) => {
  if (!schema) return null;

  return (
    <div className="space-y-4">
      {schema.map((field) => {
        if (field.type === 'hidden') return null;
        
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={data[field.name] || ''}
                onChange={(e) => onChange({ ...data, [field.name]: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            ) : field.type === 'image' ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={data[field.name] || ''}
                  onChange={(e) => onChange({ ...data, [field.name]: e.target.value })}
                  placeholder="https://"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {data[field.name] && (
                  <img src={data[field.name]} alt="preview" className="h-10 w-10 object-cover rounded" />
                )}
              </div>
            ) : (
              <input
                type={field.type}
                value={data[field.name] || ''}
                onChange={(e) => onChange({ ...data, [field.name]: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
