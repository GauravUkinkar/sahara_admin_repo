

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const getpromoActivity = async () => {
  try {
    const response = await fetch(`${baseUrl}/PramotionalActivity/GetAll`, {
      method: "GET",
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
};


 
