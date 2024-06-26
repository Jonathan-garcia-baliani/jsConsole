// fetchData.js
export async function fetchData(url, options) {
    try {
        let response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data); // Muestra los datos en la consola para depuración
        return data; // Retorna los datos para usarlos en la promesa posterior
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propaga el error para que sea manejado en el .catch del fetch en app.js
    }
}
