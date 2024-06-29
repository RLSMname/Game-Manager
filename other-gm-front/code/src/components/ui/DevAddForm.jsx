import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAddDev } from "../../utils/devs/addDev";


const schema = z.object({
  name: z.string().min(3).max(100)
});

export const DevAddForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });


  const addDev = useAddDev();

  const onSubmit = async (data) => {
    try {
      await addDev(data);
      onClose();
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} type="text" placeholder="Name" />

        {errors.name && (<div>{errors.name.message}</div>)}

        <button className="button-style-1" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>

        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </div>
  )
}
