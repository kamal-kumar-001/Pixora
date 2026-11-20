import React from 'react';

export const StudioLink: React.FC<{
  onOpen: () => void;
  className: string;
  children: React.ReactNode;
}> = ({ onOpen, className, children }) => (
  <a href="/edit" className={className} onClick={(event) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      onOpen();
    }
  }}>{children}</a>
);
