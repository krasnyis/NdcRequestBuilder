// Mount React XML Editor into #airshopping-editor
document.addEventListener('DOMContentLoaded', function() {
    const editorContainer = document.getElementById('airshopping-editor');
    if (editorContainer) {
        import('./dist/AirShoppingXmlEditor.js').then(mod => {
            ReactDOM.createRoot(editorContainer).render(React.createElement(mod.AirShoppingXmlEditor));
        });
    }
});
