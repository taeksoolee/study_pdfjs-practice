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

module.exports = {
  getPdf,
}