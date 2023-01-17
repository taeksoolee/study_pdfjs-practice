export const getB64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
      const base64data = reader.result;                
      resolve(base64data);
    }

    reader.onerror = function(err) {
      reject(err)
    }
  });
}

export const blobToBinary = async (blob) => {
  const buffer = await blob.arrayBuffer();
  const view = new Int8Array(buffer);
  return [...view].map((n) => n.toString(2)).join(' ');
};