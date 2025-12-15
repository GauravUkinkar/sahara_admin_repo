const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getFaqs = async () => {
  try {
    const response = await fetch(`${baseUrl}/faq/GetAll`, {
      method: "GET",
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
};

export const addFaqs = async (question, answer, page) => {
    try {
      console.log(question,"question")
      const response = await fetch(`${baseUrl}/faq/addFaq`, {
        method: "POST",  // ✅ Change to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
          page: page
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add FAQ: ${response.statusText}`);
      }
  
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error in addFaqs:", error);
      return null;
    }
  };
  