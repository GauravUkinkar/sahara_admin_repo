const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAboutData = async () => {
  try {
    const response = await fetch(`${baseUrl}/viedoAndAboutSection/get/2`, {
      method: "GET",
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.log(error );
  }
};





export const updateAboutData = async (title, description, buttonText, imageFile) => {
  try {
    const formData = new FormData();
    
    // Append JSON data as a string
    const data = JSON.stringify({
      title: title,
      description: description,
      buttonText: buttonText,
      buttonLink: "/contact",
    });
    formData.append("data", data);

    // Append the image file
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${baseUrl}/viedoAndAboutSection/update/2`, {
      method: "PUT",
      body: formData, // No need to set Content-Type; the browser does it automatically
    });

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
};
