// dolarService.js

/**
 * Obtiene la tasa oficial del dólar (USD a VES) desde una API pública.
 * @returns {Promise<number>} El valor de la tasa del dólar.
 */
export async function obtenerDolarBCV() {
  // Usamos una API pública de ejemplo que devuelve la tasa oficial.
  // En producción, puedes usar la API de AllRatesToday o similar.
  const url = 'https://allratestoday.com/api/open/central-bank/bcv?source=USD&target=VES';

  try {
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    
    // La API devuelve un objeto con la propiedad "rate" (la tasa oficial)
    // y "rate_date" (la fecha de vigencia).
    return datos.rate; 
  } catch (error) {
    console.error('Error al obtener el valor del dólar:', error);
    throw error; // Relanzamos el error para que quien llame a la función lo maneje.
  }
}