import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDevsContext } from "../../state/context";


const schema = z.object({
    name: z.string().min(3).max(100)
});

export const DevEditForm = ({ developerId, initialData, onClose }) => {
    const { handleEdit } = useDevsContext();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData // autocomplete initial values
    });

    const onSubmit = async (data) => {
        try {
            await handleEdit(developerId, data); // handleEdit from context
            onClose(); // close popUp
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
    );
};