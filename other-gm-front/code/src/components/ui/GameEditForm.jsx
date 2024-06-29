import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDevsContext } from "../../state/context";
import { useGamesContext } from "../../state/contextGame";


const schema = z.object({
    name: z.string().min(3).max(100),
    developer: z.string().min(3).max(100),
    price: z.coerce.number().gte(0, 'Must be 0 or above'),
    description: z.string().optional()
});

// change Context and functions
export const GameEditForm = ({ gameId, initialData, onClose }) => {
    const { handleEdit } = useGamesContext();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ...(initialData || {}),
            developer: initialData ? initialData.developer.name : ''
        }
    });

    const onSubmit = async (data) => {
        try {
            await handleEdit(gameId, data); // handleEdit from context
            onClose(); // close popUp
        } catch (error) {
            setError("root", {
                message: error.message,
            });
        }
    }

    return (<div className="login-form">
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} type="text" placeholder="Name" />

            {errors.name && (<div>{errors.name.message}</div>)}

            <input {...register("developer")} type="text" placeholder="Developer" />

            {errors.developer && (<div>{errors.developer.message}</div>)}

            <input {...register("price")} type="number" placeholder="Price" />

            {errors.price && (<div>{errors.price.message}</div>)}

            <input {...register("description")} type="text" placeholder="Description" />

            {errors.description && (<div>{errors.description.message}</div>)}



            <button className="button-style-1" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Submit"}
            </button>

            {errors.root && <div>{errors.root.message}</div>}
        </form></div>
    );
};