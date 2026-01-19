"use client";
// selama kita menggunakan cliet side rendering kita akan membutuhkan "use client"
import { useEffect, useState } from "react";

function Name() {
  const [name, setName] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [todo, setTodo] = useState<{
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }>({
    userId: 0,
    id: 0,
    title: "",
    completed: false,
  });

  const fetchDataSingle = () => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => setTodo(json));
  };

  useEffect(() => {
    fetchDataSingle();
  }, []);

  console.log("todo", todo);

  return (
    <div>
      <h1>Name</h1>
      <input type="text" value={name} onChange={handleChange} />
    </div>
  );
}

export default Name;
