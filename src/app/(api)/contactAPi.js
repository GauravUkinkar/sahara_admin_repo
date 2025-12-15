const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getContacts = async () => {
  try {
    const response = await fetch(`${baseUrl}/contact/getAllContact`, {
      method: "GET",
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
};


export const deleteContacts = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/contact/DeleteContact?cId=${id}`, {
        method: "DELETE",
      });
      const jsonData = await response.json();
      return jsonData.reverse();
    } catch (error) {
      console.log(error );
    }
  };