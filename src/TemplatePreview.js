import React from 'react';

const TemplatePreview = ({ template }) => {
  if (!template) {
    return <h3>Selecciona una plantilla para ver la vista previa</h3>;
  }

  const replaceVariables = (text, variables) => {
    let replacedText = text;
    variables.forEach(variable => {
      replacedText = replacedText.replace(variable.name, variable.example);
    });
    return replacedText;
  };

  return (
    <>
      <div className='text-center'>
        <h3 >Vista Previa de la Plantilla</h3>
      </div>
      <div className="preview-container">
        <div className="whatsapp-preview">
          <div className="message">
            <div className="header">
              {template.header_type === 'TEXT' && <div><strong>{replaceVariables(template.header_text, template.headerVariables)}</strong></div>}
              {template.header_type === 'IMAGE' && template.medio && <img src={`${process.env.REACT_APP_API_URL}${template.medio}`} alt="Header" style={{ width: '100%' }} />}
              {template.header_type === 'VIDEO' && template.medio && <video src={`${process.env.REACT_APP_API_URL}${template.medio}`} controls style={{ width: '100%' }} />}
              {template.header_type === 'DOCUMENT' && template.medio && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <iframe 
                    src={`${process.env.REACT_APP_API_URL}${template.medio}`} 
                    style={{ width: '100%', aspectRatio: '4/3', zoom: 2, border: '0', overflow: 'hidden' }} 
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
            </div>
            <div className="body">
              {replaceVariables(template.body_text, template.bodyVariables)}
            </div>
            {template.footer && <div className="footer small">{template.footer}</div>}
            {template.type_button !== 'none' && (
              <div className="buttons">
                {template.type_button === 'QUICK_REPLY' && <button className="btn btn-success w-100 mt-2">{template.button_text}</button>}
                {template.type_button === 'PHONE_NUMBER' && <button className="btn btn-success w-100 mt-2">{template.button_text}</button>}
                {template.type_button === 'URL' && <button className="btn btn-success w-100 mt-2">{template.button_text}</button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplatePreview;
