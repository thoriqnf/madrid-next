"use client";
import { useForm } from "react-hook-form";

function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitForm = () => {
    console.log("useForm");
  };
  return (
    <div>
      <h1>page product</h1>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <input {...register("name", { required: true })} placeholder="name" />
        {/* kalau butuh error sudah disiapkan dari react hook form */}
        {errors.name && <div>required input namanyaaa</div>}

        <input {...register("notes", { required: true })} placeholder="notes" />
        {errors.notes && <div>required input notes</div>}
        {/* ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ */}
        <input
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
          })}
          placeholder="email"
        />
        {errors.email && <div>required email notes</div>}

        <button type="submit">submittttt</button>
      </form>
    </div>
  );
}

export default page;
