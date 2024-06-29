const BASE_URL = "/api/devs/";

export const deleteDeveloper = async (id) => {
  const response = await fetch(BASE_URL + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete developer");
  }
};

export const updateDeveloper = async (id, updatedData) => {
  const response = await fetch(BASE_URL + id, {
    method: "PUT",
    body: JSON.stringify(updatedData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to update developer");
  }
};
