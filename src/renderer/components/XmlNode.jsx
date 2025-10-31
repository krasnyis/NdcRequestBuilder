import React from 'react';

export function XmlNode({ node, onEdit, onRemove, draggable, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        marginBottom: 12,
        border: '1.5px solid #bfc8e6',
        padding: 18,
        background: 'linear-gradient(90deg, #f9fafe 0%, #f1f4fa 100%)',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <strong style={{ fontSize: 16, color: '#3a4663', marginBottom: 8, fontWeight: 600 }}>{node.tag}</strong>
      {Object.keys(node.value).map(key => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <label style={{ minWidth: 80, fontWeight: 500, color: '#6c63ff', fontSize: 14 }}>{key}:</label>
          <input
            value={node.value[key]}
            onChange={e => onEdit(node.id, { ...node.value, [key]: e.target.value })}
            style={{
              width: '70%',
              padding: '7px 12px',
              fontSize: 15,
              borderRadius: 8,
              border: '1.5px solid #bfc8e6',
              background: '#f7faff',
              color: '#2d3552',
              boxShadow: '0 1px 4px rgba(60,80,120,0.04)',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.border = '2px solid #6c63ff')}
            onBlur={e => (e.target.style.border = '1.5px solid #bfc8e6')}
          />
        </div>
      ))}
      <button
        onClick={() => onRemove(node.id)}
        style={{
          marginTop: 10,
          alignSelf: 'flex-end',
          padding: '7px 18px',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
          border: 'none',
          borderRadius: 8,
          boxShadow: '0 1px 4px rgba(60,80,120,0.08)',
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.target.style.background = 'linear-gradient(90deg, #3a4663 0%, #6c63ff 100%)')}
        onMouseOut={e => (e.target.style.background = 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)')}
      >
        Remove
      </button>
    </div>
  );
}
