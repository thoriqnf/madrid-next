"use client";

import { useState } from "react";

const Form = () => {
  // state untuk form
  const [name, setName] = useState("state kosong");
  const [email, setEmail] = useState("email@boongan.com");

  // function handle submit
  const handleSubmit = (event) => {
    // event prevent default supaya ketika klik tidak reload halaman
    event.preventDefault();
    console.log("submit test", name, email);
    // mengembalikan state menjadi kosong seperti awal
    setName("");
    setEmail("");
  };

  console.log("form component");
  return (
    <div>
      <h1>form</h1>
      <form onSubmit={handleSubmit}>
        <p>Name</p>
        <input
          type="text"
          // value menempelkan nilai state ke input
          value={name}
          // onchange merubah state sesuai hasil user input
          onChange={(event) => setName(event.target.value)}
        />
        <p>email</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {/* button submit untuk trigger button submit ke event onsobmit */}
        <button type="submit">submit button</button>
      </form>
    </div>
  );
};

export default Form;
