interface AddFeesResponse {
  // Define the expected structure of the JSON response from the API
  // For example, if it returns a message and a transactionId:
  message?: string;
  transactionId?: string;
  // Add other fields as per the actual API response
  [key: string]: any; // Allows for other properties not explicitly defined
}

/**
 * Makes a GET request to add fees/money to a specified wallet address.
 * @param address The wallet address to which fees/money should be added.
 * @returns A promise that resolves to the JSON response from the API.
 * @throws Will throw an error if the network request fails or the API returns an error status.
 */
export async function addFeesToWallet(address: string): Promise<AddFeesResponse> {
  const baseUrl = 'https://fundamental-api.netlify.app/.netlify/functions/addFeesMoneyToWallet';
  const url = `${baseUrl}/${address}`;

  console.log(`Requesting fees for address: ${address} at ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers here
      },
    });

    if (!response.ok) {
      // Attempt to get more details from the response body if possible
      let errorBody = 'No additional error details from API.';
      try {
        errorBody = await response.text(); // Or response.json() if error is JSON
      } catch (e) {
        // Ignore if parsing error body fails
      }
      console.error(
        `API error for ${address}: ${response.status} ${response.statusText}. Body: ${errorBody}`
      );
      throw new Error(
        `Failed to add fees to wallet ${address}. Status: ${response.status}. Details: ${errorBody}`
      );
    }

    // Assuming the API returns a JSON response on success
    const data: AddFeesResponse = await response.json();
    console.log(`Successfully added fees for address ${address}:`, data);
    return data;
  } catch (error) {
    console.error(`Network or other error while adding fees for ${address}:`, error);
    // Re-throw the error so the caller can handle it
    // Ensure it's an Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unknown error occurred while adding fees for ${address}.`);
  }
}
