const URL_TASA_BCV = "https://allratestoday.com/api/open/central-bank/bcv?source=USD&target=VES";

export async function obtenerDolarBCV() {
  const respuesta = await fetch(URL_TASA_BCV);

  if (!respuesta.ok) {
    throw new Error(`No se pudo consultar la tasa BCV (HTTP ${respuesta.status}).`);
  }

  const datos = await respuesta.json();
  const tasa = Number(datos.rate);

  if (!Number.isFinite(tasa) || tasa <= 0) {
    throw new Error("La API devolvió una tasa BCV inválida.");
  }

  return tasa;
}