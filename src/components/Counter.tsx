import { useState } from "react";

function Counter() {
  // secara tidak langsung state memiliki inference (kemampuang mengambil kesimpulan)
  // meskipun ada inference kita prefer explicite (jelas / nyata
  const [count, setCount] = useState<number | string>("0");

  const [data, setData] = useState<any>(["satu", "dua", 0]);
  return (
    <div>
      <h1>Counter: {count}</h1>
    </div>
  );
}

export default Counter;
