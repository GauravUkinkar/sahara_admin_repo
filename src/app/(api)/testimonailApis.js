// testimonails

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getTestimonials = async () => {
  try {
    const response = await fetch(`${baseUrl}/testemonials/GetAll`, {
      method: "GET",
    });
    const jsonData = await response.json();
    return jsonData.reverse();
  } catch (error) {
    console.log(error );
  }
};

export const deleteTestimonials = async (testimonialId) => {
  try {
    await fetch(`${baseUrl}/testemonials/delete?id=${testimonialId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to delete testimonial: ${response.status} ${response.statusText}`
      );
    }
    return { success: true, message: "Testimonial deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const addTestimonials = async (name, review, star) => {
  try {
    await fetch(`${baseUrl}/testemonials/addTestemonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        name: name,
        feedBack: review,  
        stars: star
    })

    });
    if (!response.ok) {
      throw new Error(
        `Failed to add testimonial: ${response.status} ${response.statusText}`
      );
    }
    return { success: true, message: "Testimonial added successfully" };
  } catch (error) {
    console.log(error);
  }
};


export const updateTestimonials = async (id, name, review, star) => {
  try {
    const response = await fetch(`${baseUrl}/testemonials/updateTestemonials`, { // Store the fetch response
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: name,
        feedBack: review,
        stars: star,
      }),
    });

    if (!response.ok) { // Now response is defined
      throw new Error(
        `Failed to update testimonial: ${response.status} ${response.statusText}`
      );
    }
    return { success: true, message: "Testimonial updated successfully" };
  } catch (error) {
    console.log(error);
  }
};


