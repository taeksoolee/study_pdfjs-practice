const url = process.env.API_URL;
const token = process.env.JWT_TOKEN;
console.log(url, token);

const getPdf = () => new Promise((resolve, reject) => {
  fetch(url, {
    headers: {
      // 'response-type': 'blob',
      'authorization': 'JWT ' + token,
      'content-type': 'application/pdf',
      // 'response-type': 'blob',
    }
  })
  .then(res => res.blob())
  .then(res => {
    resolve(res);
  })
  .catch(error => {
    reject(error);
  })
});

const getB64 = (blob) => {
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

(async () => {
  // console.log(await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.2.146/build/pdf.min.js'));
  // console.log(window['pdfjslib']);
  const pdfjslib = await import('pdfjs-dist');
  // const worker = await import('pdfjs-dist/build/pdf.worker')
  // pdfjslib.GlobalWorkerOptions.workerSrc = worker;
  pdfjslib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@3.2.146/build/pdf.worker.min.js'; 
  // pdfjslib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js'; 
  // pdfjslib.GlobalWorkerOptions.workerPort = '//mozilla.github.io/pdf.js/build/pdf.worker.js'; 

  const res = await getPdf();
  const blob = new Blob([res], {
    type: 'application/pdf',
    // type: ''
  });

  const data = await getB64(blob);
  
  // 1. no-libs
  const src = URL.createObjectURL(blob);
    
  const $viewer = document.createElement('iframe');
  $viewer.style = 'width: 100vw; height: 100vh;';

  $viewer.src = src;
  document.getElementById('root').appendChild($viewer);
})();