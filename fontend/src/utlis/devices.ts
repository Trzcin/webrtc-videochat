export async function getDevices() {
  return await navigator.mediaDevices.enumerateDevices();
}
