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
  const [showPreview, setShowPreview] = useState(false);
  const [nextId, setNextId] = useState(1);

  const buildXml = React.useCallback(() => {
    return `<?xml version="1.0" encoding="utf-8"?>
<IATA_AirShoppingRQ xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersMessage">
    <PayloadAttributes>
        <VersionNumber xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">21.3</VersionNumber>
    </PayloadAttributes>
    <DistributionChain>
${chainLinks.map(link => `        <DistributionChainLink xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">
            <Ordinal>${link.value.Ordinal}</Ordinal>
            <OrgRole>${link.value.OrgRole}</OrgRole>
            <ParticipatingOrg>
                <Name>${link.value.Name}</Name>
                <OrgID>${link.value.OrgID}</OrgID>
            </ParticipatingOrg>
        </DistributionChainLink>`).join('\n')}
    </DistributionChain>
    <Request>
        <FlightRequest xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">
            <FlightRequestOriginDestinationsCriteria>
${origins.map(origin => `                <OriginDestCriteria>
                    <OriginDepCriteria>
                        <Date>${origin.value.Date}</Date>
                        <IATA_LocationCode>${origin.value.Origin}</IATA_LocationCode>
                    </OriginDepCriteria>
                    <DestArrivalCriteria>
                        <IATA_LocationCode>${origin.value.Destination}</IATA_LocationCode>
                    </DestArrivalCriteria>
                </OriginDestCriteria>`).join('\n')}
            </FlightRequestOriginDestinationsCriteria>
        </FlightRequest>
        <PaxList xmlns="http://www.iata.org/IATA/2015/EASD/00/IATA_OffersAndOrdersCommonTypes">
${paxes.map(pax => `            <Pax>
                <PaxID>${pax.value.PaxID}</PaxID>
                <PTC>${pax.value.PTC}</PTC>
            </Pax>`).join('\n')}
        </PaxList>
    </Request>
</IATA_AirShoppingRQ>`;
  }, [chainLinks, origins, paxes]);

  useEffect(() => {
    setXmlPreview(prettyXml(buildXml()));
  }, [buildXml]);

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
        setNextId(currentId => {
          setChainLinks(list => [...list, { id: currentId, tag: component.tag, value: { ...component.defaultValue } }]);
          return currentId + 1;
        });
      } else if (component.tag === 'OriginDestCriteria') {
        setNextId(currentId => {
          setOrigins(list => [...list, { id: currentId, tag: component.tag, value: { ...component.defaultValue } }]);
          return currentId + 1;
        });
      } else if (component.tag === 'Pax') {
        setNextId(currentId => {
          setPaxes(list => [...list, { id: currentId, tag: component.tag, value: { ...component.defaultValue } }]);
          return currentId + 1;
        });
      }
    }
    // The useEffect will automatically update the XML preview when state changes
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
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e3e7ed 100%)',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative',
    }}>
      {/* Toggle Preview Button - Fixed Position */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        style={{
          position: 'fixed',
          top: 100,
          right: 20,
          zIndex: 1000,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          background: showPreview 
            ? 'linear-gradient(90deg, #ff6b6b 0%, #c92a2a 100%)'
            : 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
      >
        <span>{showPreview ? '✕' : '👁'}</span>
        {showPreview ? 'Hide Preview' : 'Show XML Preview'}
      </button>

      {/* Main Content Area */}
      <div style={{
        display: 'flex',
        gap: 32,
        padding: 32,
        flex: 1,
        overflow: 'auto',
        transition: 'all 0.3s ease',
      }}>
        {/* Components List and Drop Zones - Hidden when preview is shown */}
        {!showPreview && (
          <div style={{
            display: 'flex',
            gap: 32,
            flex: 1,
            transition: 'all 0.3s ease',
          }}>
            {/* Components List */}
            <div style={{
              width: 340,
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
              border: '1px solid #e0e4ea',
              background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)',
              padding: 24,
              height: 'fit-content',
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

            {/* Request Area (Drag Target) */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                flex: 1,
                minWidth: 400,
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
          </div>
        )}

        {/* XML Preview Panel - Full width when shown */}
        {showPreview && (
          <div style={{
            flex: 1,
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
                  fontSize: 14,
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
        )}
      </div>
    </div>
  );
}
