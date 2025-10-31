// ui.js - AirShopping XML Editor with drag-and-drop for DistributionChainLink, OriginDestCriteria, and Pax

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

function XmlNode({ node, onEdit, onRemove, draggable, onDragStart, onDragOver, onDrop }) {
  // Inline editing for each field
  return React.createElement(
    'div',
    {
      style: {
        marginBottom: 12,
        border: '1.5px solid #bfc8e6',
        padding: 18,
        background: 'linear-gradient(90deg, #f9fafe 0%, #f1f4fa 100%)',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      },
      draggable,
      onDragStart: onDragStart,
      onDragOver: onDragOver,
      onDrop: onDrop,
    },
    React.createElement('strong', { style: { fontSize: 16, color: '#3a4663', marginBottom: 8, fontWeight: 600 } }, node.tag),
    ...Object.keys(node.value).map(key =>
      React.createElement('div', {
        key,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 6,
        }
      },
        React.createElement('label', {
          style: {
            minWidth: 80,
            fontWeight: 500,
            color: '#6c63ff',
            fontSize: 14,
          }
        }, key + ':'),
        React.createElement('input', {
          value: node.value[key],
          onChange: e => onEdit(node.id, { ...node.value, [key]: e.target.value }),
          style: {
            marginBottom: 0,
            width: '70%',
            padding: '7px 12px',
            fontSize: 15,
            borderRadius: 8,
            border: '1.5px solid #bfc8e6',
            background: '#f7faff',
            color: '#2d3552',
            boxShadow: '0 1px 4px rgba(60,80,120,0.04)',
            outline: 'none',
            transition: 'border 0.2s',
          },
          onFocus: e => e.target.style.border = '2px solid #6c63ff',
          onBlur: e => e.target.style.border = '1.5px solid #bfc8e6',
        })
      )
    ),
    React.createElement('button', {
      onClick: () => onRemove(node.id),
      style: {
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
        transition: 'background 0.2s',
      },
      onMouseOver: e => e.target.style.background = 'linear-gradient(90deg, #3a4663 0%, #6c63ff 100%)',
      onMouseOut: e => e.target.style.background = 'linear-gradient(90deg, #6c63ff 0%, #3a4663 100%)',
    }, 'Remove')
  );
}

function prettyXml(xml) {
  // Simple pretty print for XML string
  const PADDING = '  ';
  let formatted = '';
  const reg = /(>)(<)(\/*)/g; // <-- FIX: should be /(>)(<)(\/*)/g in code, but JS needs single backslash
  xml = xml.replace(/>(<\/*)/g, '>$1\r\n'); // FIX: use single backslash in regex
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

function AirShoppingXmlEditor() {
  const [chainLinks, setChainLinks] = React.useState([]);
  const [origins, setOrigins] = React.useState([]);
  const [paxes, setPaxes] = React.useState([]);

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
        setChainLinks(list => [...list, { id: Date.now(), tag: component.tag, value: { ...component.defaultValue } }]);
      } else if (component.tag === 'OriginDestCriteria') {
        setOrigins(list => [...list, { id: Date.now(), tag: component.tag, value: { ...component.defaultValue } }]);
      } else if (component.tag === 'Pax') {
        setPaxes(list => [...list, { id: Date.now(), tag: component.tag, value: { ...component.defaultValue } }]);
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

  // XML generation
  function buildXml() {
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
  }

  const [xmlPreview, setXmlPreview] = React.useState(prettyXml(buildXml()));

  // Update xmlPreview when nodes change
  React.useEffect(() => {
    setXmlPreview(prettyXml(buildXml()));
  }, [chainLinks, origins, paxes]);

  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        gap: 32,
        padding: 32,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3e7ed 100%)',
        minHeight: '100vh',
        fontFamily: 'Inter, Arial, sans-serif',
      }
    },
    // Components List
    React.createElement(
      'div',
      {
        style: {
          width: 340,
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          border: '1px solid #e0e4ea',
          background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecf3 100%)',
          padding: 24,
        }
      },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' } }, 'Components'),
      ...COMPONENTS.map(c =>
        React.createElement(
          'div',
          {
            key: c.tag,
            draggable: true,
            onDragStart: handleDragStartComponent(c),
            style: {
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
            },
            onMouseOver: e => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(60,80,120,0.18)';
              e.currentTarget.style.border = '2px solid #3a4663';
            },
            onMouseOut: e => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(60,80,120,0.10)';
              e.currentTarget.style.border = '2px solid #6c63ff';
            },
          },
          React.createElement('span', {
            style: {
              display: 'inline-block',
              width: 22,
              height: 22,
              background: 'url("data:image/svg+xml,%3Csvg width=\'22\' height=\'22\' viewBox=\'0 0 22 22\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'6\' y=\'5\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3Crect x=\'6\' y=\'10\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3Crect x=\'6\' y=\'15\' width=\'10\' height=\'2\' rx=\'1\' fill=\'%236c63ff\'/%3E%3C/svg%3E") no-repeat center',
              marginRight: 4,
              opacity: 0.7,
            }
          }),
          c.label
        )
      )
    ),
    // Request Area (Drag Target) - single scrollable drop zone with reordering
    React.createElement(
      'div',
      {
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        style: {
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
        }
      },
      React.createElement('h3', { style: { margin: '0 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' } }, 'DistributionChain'),
      chainLinks.length === 0 && React.createElement('div', { style: { color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' } }, 'Drag DistributionChainLink here.'),
      ...chainLinks.map(node =>
        React.createElement(XmlNode, {
          key: node.id,
          node,
          onEdit: (id, val) => handleEdit('chain', id, val),
          onRemove: id => handleRemove('chain', id),
          draggable: true,
          onDragStart: handleNodeDragStart('chain', node.id),
          onDragOver: handleNodeDragOver,
          onDrop: handleNodeDrop('chain', node.id),
        })
      ),
      React.createElement('h3', { style: { margin: '24px 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' } }, 'OriginDestCriteria'),
      origins.length === 0 && React.createElement('div', { style: { color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' } }, 'Drag OriginDestCriteria here.'),
      ...origins.map(node =>
        React.createElement(XmlNode, {
          key: node.id,
          node,
          onEdit: (id, val) => handleEdit('origin', id, val),
          onRemove: id => handleRemove('origin', id),
          draggable: true,
          onDragStart: handleNodeDragStart('origin', node.id),
          onDragOver: handleNodeDragOver,
          onDrop: handleNodeDrop('origin', node.id),
        })
      ),
      React.createElement('h3', { style: { margin: '24px 0 16px 0', fontWeight: 600, fontSize: 18, color: '#3a4663' } }, 'Pax'),
      paxes.length === 0 && React.createElement('div', { style: { color: '#bfc8e6', marginBottom: 8, fontStyle: 'italic' } }, 'Drag Pax here.'),
      ...paxes.map(node =>
        React.createElement(XmlNode, {
          key: node.id,
          node,
          onEdit: (id, val) => handleEdit('pax', id, val),
          onRemove: id => handleRemove('pax', id),
          draggable: true,
          onDragStart: handleNodeDragStart('pax', node.id),
          onDragOver: handleNodeDragOver,
          onDrop: handleNodeDrop('pax', node.id),
        })
      )
    ),
    // Response Area (Preview) - modern editable area
    React.createElement(
      'div',
      {
        style: {
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
        }
      },
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #e0e4ea',
          background: 'transparent',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }
      },
        React.createElement('h3', { style: { margin: 0, fontWeight: 700, fontSize: 19, color: '#2d3552', letterSpacing: '0.01em' } }, 'XML Editor'),
        React.createElement('span', { style: { fontSize: 13, color: '#7a8ca7', fontWeight: 500 } }, 'Live Preview & Edit')
      ),
      React.createElement('div', {
        style: {
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }
      },
        React.createElement('textarea', {
          value: xmlPreview,
          onChange: e => setXmlPreview(e.target.value),
          spellCheck: false,
          style: {
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
          },
          onFocus: e => e.target.style.border = '2px solid #6c63ff',
          onBlur: e => e.target.style.border = '1.5px solid #bfc8e6',
        })
      )
    )
  );
}

// For direct usage in index.html, keep this render call, but you can also import AirShoppingXmlEditor elsewhere
ReactDOM.render(
  React.createElement(AirShoppingXmlEditor),
  document.getElementById('app')
);

// Export for injection in other apps
window.AirShoppingXmlEditor = AirShoppingXmlEditor;