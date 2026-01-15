"use client";

import { useEffect, useState } from "react";

const Product = () => {
  const [count, setCount] = useState(12345);
  const [like, setLike] = useState(12345);
  const [todo, setTodo] = useState({ title: "" });

  const handleCount = () => {
    setCount(count + 1);
  };

  const handleLike = () => {
    setLike(like + 1);
  };

  const fetchTodo = () => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((data) => setTodo(data));
  };

  useEffect(() => {
    console.log("use effect");
    fetchTodo();
  }, []);

  // [] dependency array
  // ini seperti watchlist, jika [] maka kita tidak memiliki watchlist dan hanya jalan 1 kali diawal
  // kalau tidak ada watchlist artinya kita melihat semua perubahan render yang terjadi
  // kalau tidak ada watchlist dan kalian melakukan fetch data maka akan terjadi hal yang tidak diinginkan

  console.log("render");

  return (
    <div>
      <h1>Product</h1>
      <h1>counter {count}</h1>
      <button onClick={handleCount}>+ biasa</button>

      <div>
        <h1>like {like}</h1>
        <button onClick={handleLike}>+ like</button>
      </div>
    </div>
  );
};

export default Product;
