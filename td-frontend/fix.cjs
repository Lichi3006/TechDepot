const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/lisan/Desktop/Proyectos/TechDepot/td-frontend/src/pages/Admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  if (content.includes("style={{ padding: '24px' }}")) {
    content = content.replace(/<header className="glass-panel" style={{ padding: '24px' }}>/g, '<header className="glass-panel admin-header">');
    modified = true;
  }
  
  if (content.includes("style={cardStyle}")) {
    content = content.replace(/className="glass-panel" style={cardStyle}/g, 'className="glass-panel admin-card"');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', file);
  }
}
