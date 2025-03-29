import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
// import rehypeRaw from 'rehype-raw'; // Keep this commented out
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import { Typography, useTheme } from '@mui/material';
import remarkImages from 'remark-images'; // Add this import back

interface MarkdownRendererProps {
  markdownContent: string;
}

interface ImageNode {
  properties: {
    src: string;
    alt?: string;
    title?: string;
  };
}

interface ReactMarkdownImageProps {
  node: ImageNode;
  src?: string;
  alt?: string;
  title?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownContent,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const syntaxHighlighterTheme = isDarkMode ? dracula : vs;

  const components = {
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');

      if (!inline && match && match[1] === 'math') {
        return <BlockMath math={codeContent} />;
      }

      return !inline && match ? (
        <SyntaxHighlighter
          children={codeContent}
          style={syntaxHighlighterTheme}
          language={match[1]}
          {...props}
        />
      ) : (
        <code
          className={className}
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            padding: '0.2em 0.4em',
            borderRadius: '3px',
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    img: ({ node, ...props }: ReactMarkdownImageProps) => {
      const src = node.properties.src;
      console.log('src:', src);
      return <img {...props} src={src} style={{ maxWidth: '100%' }} />; // Ensure the <img> tag is returned and add maxWidth
    },
  };

  return (
    <Typography component='div' sx={{ color: theme.palette.text.primary }}>
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkMath, remarkImages]} // Add remarkImages here
        components={components}
      />
    </Typography>
  );
};

export default MarkdownRenderer;
