import React from 'react';

interface JsonViewerProps {
  jsonString: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ jsonString }) => {
  let formattedJson: string;

  try {
    const jsonObject = JSON.parse(jsonString);
    formattedJson = JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    formattedJson = 'Invalid JSON string';
  }

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
      {formattedJson}
    </pre>
  );
};

export default JsonViewer;