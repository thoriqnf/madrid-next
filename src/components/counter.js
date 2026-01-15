"use client";

import { useState } from "react";
import CounterChild from "./counterChild";

const Counter = () => {
  // pembuatan state berbeda dari variable
  const [count, setCount] = useState(12345);
  console.log("render");

  const handleCount = () => {
    setCount(count + 1);
  };

  const handleCount2 = () => {
    setCount((prev) => prev + 1); // previous
  };
  return (
    <>
      <h1>Counter Component</h1>
      <CounterChild count={count} setCount={setCount} />

      <div>
        {/* <h1>Variable {testVariable}</h1> */}
        <button onClick={handleCount}>+ biasa</button>
        <button onClick={handleCount2}>+ arrow</button>
      </div>
    </>
  );
};

export default Counter;

// const Counter = () => {
//   let count = 0;

//   const handleClick = () => {
//     count++;
//     console.log("count", count);
//   };
//   return (
//     <>
//       <button onClick={handleClick}>count: {count}</button>
//     </>
//   );
// };
