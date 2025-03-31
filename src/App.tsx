import MarkdownRenderer from './MarkdownRenderer';
import {
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
} from '@mui/material';
import { useState, useMemo } from 'react';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const fullMarkdownText = `
# My Markdown Content

This is some **bold** text and some *italic* text.

## Mathematical Equations
Here's an inline equation: $\\theta = \\pi/2$.
And a block equation:
$$
E = mc^2
$$

## Base64 Image 1
![Base64 Image 1](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==)

Some text in between images.

## Base64 Image 2
![Another Base64 Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==)

## Code Blocks
\`\`\`typescript
function greet(name: string): void {
  console.log(\`Hello, ${name}!\`);
}
greet("World");
\`\`\`
  `;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='md'>
        <h1>Markdown Preview</h1>
        <Switch checked={mode === 'dark'} onChange={handleThemeChange} />
        <span>{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        <MarkdownRenderer markdownContent={fullMarkdownText} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
