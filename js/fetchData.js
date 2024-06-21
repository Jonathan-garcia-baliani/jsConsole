// fetchData.js

export async function fetchData(url) {
  try {
      let response = await fetch(url);

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data = await response.json();
      console.log(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
