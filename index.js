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

  // const data = await getB64(blob);

  const src = URL.createObjectURL(blob);
  
  // console.log(data);
  // const arrayBuffer = await blob.arrayBuffer();
  // const binaryData = await blobToBinary(blob);
  // console.log(binaryData);
  const loadingTask = pdfjslib.getDocument(src);
  console.log(loadingTask);
  loadingTask.promise.then((pdf) => {
    console.log(pdf);

    pdf.getPage(2)
      .then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({scale});

        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          console.log('render success!');
        });
      });
  })
})();

