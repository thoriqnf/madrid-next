import React from 'react';

export default function DemoComponent({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={() => console.log('clicked')}>Click me</button>
    </div>
  );
}
