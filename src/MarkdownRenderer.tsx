import React from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import { Typography, useTheme } from '@mui/material';

interface MarkdownRendererProps {
  markdownContent: string;
}

/**
 * A simplified Markdown renderer that supports Base64 images
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownContent,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const syntaxHighlighterTheme = isDarkMode ? dracula : vs;

  // Custom URL transform function to allow Base64 images
  const customUrlTransform = (url: string) => {
    // If it's a Base64 data URL for an image, allow it
    if (url.startsWith('data:image/')) {
      return url;
    }

    // Otherwise, use the default URL transform for safety
    return defaultUrlTransform(url);
  };

  // Define components for ReactMarkdown
  const components: Components = {
    // Custom image component to add styling to Base64 images
    // img: (props) => {
    //   // const isBase64 = props.src && props.src.startsWith('data:image/');

    //   // // Add styling to Base64 images to make them more visible
    //   // if (isBase64) {
    //   //   return (
    //   //     <img
    //   //       {...props}
    //   //       style={{
    //   //         maxWidth: '100%',
    //   //         // border: '2px solid red',
    //   //         padding: '10px',
    //   //         // backgroundColor: 'white',
    //   //         display: 'block',
    //   //       }}
    //   //     />
    //   //   );
    //   // }

    //   // For regular images, use default styling
    //   return <img {...props} style={{ maxWidth: '100%' }} />;
    // },

    // Override the default code component for syntax highlighting
    code: (props) => {
      const { className, children } = props;
      const match = /language-(\w+)/.exec(className || '');

      // Skip math blocks - they will be handled by rehypeKatex
      if (match && match[1] === 'math') {
        return null;
      }

      const codeContent = String(children).replace(/\n$/, '');
      const isInline = !match;

      return !isInline && match ? (
        <SyntaxHighlighter style={syntaxHighlighterTheme} language={match[1]}>
          {codeContent}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    },
  };

  return (
    <Typography component='div' sx={{ color: theme.palette.text.primary }}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[
          rehypeKatex, // Use rehypeKatex to handle math rendering
          rehypeRaw, // Enable raw HTML rendering for the img tags
        ]}
        components={components}
        urlTransform={customUrlTransform} // Allow Base64 images
      >
        {markdownContent}
      </ReactMarkdown>
    </Typography>
  );
};

export default MarkdownRenderer;
