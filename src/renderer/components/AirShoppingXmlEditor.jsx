import React, { useState, useEffect } from 'react';
import { XmlNode } from './XmlNode';

const COMPONENTS = [
  {
    tag: 'DistributionChainLink',
    label: 'DistributionChainLink',
    defaultValue: {
      Ordinal: '1',
      OrgRole: 'Distributor',
      Name: 'TestOrgName',
      OrgID: 'TestOrgId',
    },
  },
  {
    tag: 'OriginDestCriteria',
    label: 'OriginDestCriteria',
    defaultValue: {
      Date: '2025-11-11',
      Origin: 'ANC',
      Destination: 'PDX',
    },
  },
  {
    tag: 'Pax',
    label: 'Pax',
    defaultValue: {
      PaxID: 'TestPaxID',
      PTC: 'ADT',
    },
  },
];

function prettyXml(xml) {
  const PADDING = '  ';
  let formatted = '';
  xml = xml.replace(/>(<\/*)/g, '>$1\r\n');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/.+>$/)) {
      indent = 0;
    } else if (node.match(/^<\/.+/)) {
      if (pad !== 0) pad -= 1;
    } else if (node.match(/^<[^!?].*>$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    formatted += PADDING.repeat(pad) + node + '\n';
    pad += indent;
  });
  return formatted;
}

export function AirShoppingXmlEditor() {
  const [chainLinks, setChainLinks] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [paxes, setPaxes] = useState([]);
  const [xmlPreview, setXmlPreview] = useState('');
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    setXmlPreview(prettyXml(buildXml()));
  }, [chainLinks, origins, paxes]);

  function buildXml() {
    return `<?xml version="1.0" encoding="utf-8"?>\n<IATA_AirShoppingRQ xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n    xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n    xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage">\n    <PayloadAttributes>\n        <VersionNumber xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">21.3</VersionNumber>\n    </PayloadAttributes>\n    <DistributionChain>\n${chainLinks.map(link => `        <DistributionChainLink xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">\n            <Ordinal>${link.value.Ordinal}</Ordinal>\n            <OrgRole>${link.value.OrgRole}</OrgRole>\n            <ParticipatingOrg>\n                <Name>${link.value.Name}</Name>\n                <OrgID>${link.value.OrgID}</OrgID>\n            </ParticipatingOrg>\n        </DistributionChainLink>`).join('\n')}\n    </DistributionChain>\n    <Request>\n        <FlightRequest xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">\n            <FlightRequestOriginDestinationsCriteria>\n${origins.map(origin => `                <OriginDestCriteria>\n                    <OriginDepCriteria>\n                        <Date>${origin.value.Date}</Date>\n                        <IATA_LocationCode>${origin.value.Origin}</IATA_LocationCode>\n                    </OriginDepCriteria>\n                    <DestArrivalCriteria>\n                        <IATA_LocationCode>${origin.value.Destination}</IATA_LocationCode>\n                    </DestArrivalCriteria>\n                </OriginDestCriteria>`).join('\n')}\n            </FlightRequestOriginDestinationsCriteria>\n        </FlightRequest>\n        <PaxList xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">\n${paxes.map(pax => `            <Pax>\n                <PaxID>${pax.value.PaxID}</PaxID>\n                <PTC>${pax.value.PTC}</PTC>\n            </Pax>`).join('\n')}\n        </PaxList>\n    </Request>\n</IATA_AirShoppingRQ>`;
  }

  // Drag and drop handlers for adding new nodes
  const handleDragStartComponent = (component) => (e) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
    e.dataTransfer.setData('source', 'component');
  };
  // Drag and drop handlers for reordering nodes
  const handleNodeDragStart = (type, id) => (e) => {
    e.dataTransfer.setData('nodeId', id);
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.setData('source', 'node');
  };
  const handleNodeDragOver = (e) => {
    e.preventDefault();
  };
  const handleNodeDrop = (type, targetId) => (e) => {
    e.preventDefault();
    if (e.dataTransfer.getData('source') === 'node' && e.dataTransfer.getData('nodeType') === type) {
      const draggedId = parseInt(e.dataTransfer.getData('nodeId'));
      if (type === 'chain') {
        setChainLinks(list => {
          const dragged = list.find(n => n.id === draggedId);
          const filtered = list.filter(n => n.id !== draggedId);
          const targetIdx = filtered.findIndex(n => n.id === targetId);
          const newList = [...filtered.slice(0, targetIdx), dragged, ...filtered.slice(targetIdx)];
          return newList;
        });
      } else if (type === 'origin') {
        setOrigins(list => {
          const dragged = list.find(n => n.id === draggedId);
          const filtered = list.filter(n => n.id !== draggedId);
          const targetIdx = filtered.findIndex(n => n.id === targetId);
          const newList = [...filtered.slice(0, targetIdx), dragged, ...filtered.slice(targetIdx)];
          return newList;
        });
      } else if (type === 'pax') {
        setPaxes(list => {
          const dragged = list.find(n => n.id === draggedId);
          const filtered = list.filter(n => n.id !== draggedId);
          const targetIdx = filtered.findIndex(n => n.id === targetId);
          const newList = [...filtered.slice(0, targetIdx), dragged, ...filtered.slice(targetIdx)];
          return newList;
        });
      }
    }
    // If dropping a new component, do nothing here
  };
  // Drop handler for adding new nodes
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.getData('source') === 'component') {
      const component = JSON.parse(e.dataTransfer.getData('component'));
      if (component.tag === 'DistributionChainLink') {
        setChainLinks(list => [...list, { id: nextId, tag: component.tag, value: { ...component.defaultValue } }]);
        setNextId(id => id + 1);
      } else if (component.tag === 'OriginDestCriteria') {
        setOrigins(list => [...list, { id: nextId, tag: component.tag, value: { ...component.defaultValue } }]);
        setNextId(id => id + 1);
      } else if (component.tag === 'Pax') {
        setPaxes(list => [...list, { id: nextId, tag: component.tag, value: { ...component.defaultValue } }]);
        setNextId(id => id + 1);
      }
    }
    // Beautify the editable area after drop
    setTimeout(() => {
      setXmlPreview(prettyXml(buildXml()));
    }, 0);
  };
  const handleDragOver = (e) => e.preventDefault();

  // Edit node value
  const handleEdit = (type, id, newValue) => {
    if (type === 'chain') setChainLinks(list => list.map(n => n.id === id ? { ...n, value: newValue } : n));
    if (type === 'origin') setOrigins(list => list.map(n => n.id === id ? { ...n, value: newValue } : n));
    if (type === 'pax') setPaxes(list => list.map(n => n.id === id ? { ...n, value: newValue } : n));
  };
  // Remove node
  const handleRemove = (type, id) => {
    if (type === 'chain') setChainLinks(list => list.filter(n => n.id !== id));
    if (type === 'origin') setOrigins(list => list.filter(n => n.id !== id));
    if (type === 'pax') setPaxes(list => list.filter(n => n.id !== id));
  };

  return (
    <div style={{
      display: 'flex',
      gap: 32,
      padding: 32,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e3e7ed 100%)',
      minHeight: '100vh',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      {/* Components List */}
      <div style={{
        width: 340,
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: '1px solid #e0e4ea',
        background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)',
        padding: 24,
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' }}>Components</h3>
        {COMPONENTS.map(c => (
          <div
            key={c.tag}
            draggable
            onDragStart={handleDragStartComponent(c)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              border: '2px solid #6c63ff',
              marginBottom: 16,
              cursor: 'grab',
              background: 'linear-gradient(90deg, #e3e7ed 0%, #f6f8fa 100%)',
              borderRadius: 12,
              fontWeight: 600,
              color: '#3a4663',
              boxShadow: '0 4px 16px rgba(60,80,120,0.10)',
              transition: 'box-shadow 0.2s, border 0.2s',
              position: 'relative',
              userSelect: 'none',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 22,
              height: 22,
              background: 'url("data:image/svg+xml,%3Csvg width=\'22\' height=\'22\' viewBox=\'0 0 22 22\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'6\' y=\'5\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3Crect x=\'6\' y=\'10\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3Crect x=\'6\' y=\'15\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3C/svg%3E") no-repeat center',
              marginRight: 4,
              opacity: 0.7,
            }} />
            {c.label}
          </div>
        ))}
      </div>
      {/* Request Area (Drag Target) - single scrollable drop zone with reordering */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          width: 540,
          minHeight: 200,
          maxHeight: 800,
          overflowY: 'auto',
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          border: '2px dashed #bfc8e6',
          padding: 32,
          background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' }}>DistributionChain</h3>
        {chainLinks.length === 0 && <div style={{ color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' }}>Drag DistributionChainLink here.</div>}
        {chainLinks.map(node => (
          <XmlNode
            key={node.id}
            node={node}
            onEdit={(id, val) => handleEdit('chain', id, val)}
            onRemove={id => handleRemove('chain', id)}
            draggable={true}
            onDragStart={handleNodeDragStart('chain', node.id)}
            onDragOver={handleNodeDragOver}
            onDrop={handleNodeDrop('chain', node.id)}
          />
        ))}
        <h3 style={{ margin: '24px 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' }}>OriginDestCriteria</h3>
        {origins.length === 0 && <div style={{ color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' }}>Drag OriginDestCriteria here.</div>}
        {origins.map(node => (
          <XmlNode
            key={node.id}
            node={node}
            onEdit={(id, val) => handleEdit('origin', id, val)}
            onRemove={id => handleRemove('origin', id)}
            draggable={true}
            onDragStart={handleNodeDragStart('origin', node.id)}
            onDragOver={handleNodeDragOver}
            onDrop={handleNodeDrop('origin', node.id)}
          />
        ))}
        <h3 style={{ margin: '24px 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' }}>Pax</h3>
        {paxes.length === 0 && <div style={{ color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' }}>Drag Pax here.</div>}
        {paxes.map(node => (
          <XmlNode
            key={node.id}
            node={node}
            onEdit={(id, val) => handleEdit('pax', id, val)}
            onRemove={id => handleRemove('pax', id)}
            draggable={true}
            onDragStart={handleNodeDragStart('pax', node.id)}
            onDragOver={handleNodeDragOver}
            onDrop={handleNodeDrop('pax', node.id)}
          />
        ))}
      </div>
      {/* Response Area (Preview) - modern editable area */}
      <div style={{
        width: 1500,
        maxHeight: 800,
        overflowY: 'auto',
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(60,80,120,0.10)',
        border: '1px solid #dbe2ef',
        background: 'linear-gradient(135deg, #f7faff 0%, #e3e7ed 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e0e4ea',
          background: 'transparent',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 19, color: '#2d3552', letterSpacing: '0.01em' }}>XML Editor</h3>
          <span style={{ fontSize: 13, color: '#7a8ca7', fontWeight: 500 }}>Live Preview & Edit</span>
        </div>
        <div style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
          <textarea
            value={xmlPreview}
            onChange={e => setXmlPreview(e.target.value)}
            spellCheck={false}
            style={{
              background: 'linear-gradient(90deg, #f4f7fa 0%, #e9ecf3 100%)',
              padding: 18,
              minHeight: 600,
              fontSize: 16,
              fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
              whiteSpace: 'pre',
              margin: 0,
              width: '100%',
              resize: 'vertical',
              borderRadius: 12,
              border: '1.5px solid #bfc8e6',
              boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
              color: '#2d3552',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => (e.target.style.border = '2px solid #6c63ff')}
            onBlur={e => (e.target.style.border = '1.5px solid #bfc8e6')}
          />
        </div>
      </div>
    </div>
  );
}
