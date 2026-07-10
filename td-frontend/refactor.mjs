import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\lisan\\Desktop\\Proyectos\\TechDepot\\td-frontend\\src\\pages\\Admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'PortManagerPage.tsx');

const regexes = [
    /<Button\s+onClick=\{([^}]+)\}\s+variant="danger"\s+style=\{[^}]+\}\s*>\s*Eliminar\s*<\/Button>/g,
    /<Button\s+variant="danger"\s+onClick=\{([^}]+)\}\s+style=\{[^}]+\}\s*>\s*Eliminar\s*<\/Button>/g,
    /<Button\s+onClick=\{([^}]+)\}\s+variant="danger"\s*>\s*Eliminar\s*<\/Button>/g
];

const replacement = `<button 
                                            type="button" 
                                            onClick={$1}
                                            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', padding: '4px 8px' }}
                                            title="Eliminar"
                                        >
                                            ×
                                        </button>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    for (const regex of regexes) {
        newContent = newContent.replace(regex, replacement);
    }
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
}
