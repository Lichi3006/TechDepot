import os
import re

directory = r'C:\Users\lisan\Desktop\Proyectos\TechDepot\td-frontend\src\pages\Admin'

button_pattern = re.compile(r'<Button\s+onClick=\{([^}]+)\}\s+variant="danger"\s+style=\{[^}]+\}\s*>\s*Eliminar\s*</Button>', re.DOTALL)
button_pattern2 = re.compile(r'<Button\s+variant="danger"\s+onClick=\{([^}]+)\}\s+style=\{[^}]+\}\s*>\s*Eliminar\s*</Button>', re.DOTALL)
button_pattern3 = re.compile(r'<Button\s+onClick=\{([^}]+)\}\s+variant="danger"\s*>\s*Eliminar\s*</Button>', re.DOTALL)


replacement_template = '''<button 
                                            type="button" 
                                            onClick={%s}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--danger-color)',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                padding: '4px 8px'
                                            }}
                                            title="Eliminar"
                                        >
                                            ×
                                        </button>'''

for filename in os.listdir(directory):
    if filename.endswith('.tsx') and filename != 'PortManagerPage.tsx':
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        
        def replacer(match):
            onclick = match.group(1)
            return replacement_template % onclick
            
        new_content = button_pattern.sub(replacer, new_content)
        new_content = button_pattern2.sub(replacer, new_content)
        new_content = button_pattern3.sub(replacer, new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {filename}')
