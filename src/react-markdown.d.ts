import { Components as DefaultComponents } from 'react-markdown';
import React from 'react';

declare module 'react-markdown' {
  interface Components extends DefaultComponents {
    math?: ({ value }: { value: string }) => React.ReactElement;
    inlineMath?: ({ value }: { value: string }) => React.ReactElement;
  }
}
