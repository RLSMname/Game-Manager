import { useDevsContext } from "../../state/context";

// DevsContext.provider value={devs, setDevs}

export const useAddDev = () => {
  const { devs, setDevs } = useDevsContext();
  const addDev = async (developer) => {
    await fetch("/api/devs/add", {
      method: "POST",
      body: JSON.stringify({
        name: developer.name,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.status == 400) throw new Error("Wrong Dev name");
        if (response.status == 500) throw new Error("Duplicate dev name");
        return response.json();
      })
      .then((data) => {
        const addedDev = {
          id: data.id,
          name: data.name,
        };
        setDevs([...devs, addedDev]);
      })
      .catch((err) => {
        throw err;
      });
  };

  return addDev;
};
