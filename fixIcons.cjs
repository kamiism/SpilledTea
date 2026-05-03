const fs = require('fs');
const path = require('path');

function processDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('iconsax-react')) {
        let modified = content.replace(/<(MessageSquare|Trash2|Send|Tag|Clock|X|Eye|DocumentText|Home|User)\s+size=\{([0-9]+)\}\s*\/>/g, '<$1 size={$2} color="currentColor" />');
        
        // Also catch <IconName /> without size
        modified = modified.replace(/<(MessageSquare|Trash2|Send|Tag|Clock|X|Eye|DocumentText|Home|User)\s*\/>/g, '<$1 color="currentColor" />');

        if (modified !== content) {
          fs.writeFileSync(fullPath, modified);
          console.log('Updated', fullPath);
        }
      }
    }
  });
}

processDir('c:/Users/kumar/Desktop/SpilledTea/spilledTea/src');
