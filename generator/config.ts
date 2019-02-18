export const clientPath = './client/src/api/'
export const decorators = {
    Get: "return new Promise((resolve) => get('{url}').then((data:any) => {resolve}))",
    Post: "return new Promise((resolve) => post('{url}',{body}).then((data:any) => {resolve}))"
}
export const httpServiceTemplate = `
    function handleErrors(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      }
      
      export const get = (url: string) => {
        return new Promise((resolve) => {
          fetch(url).then(handleErrors).then(response => resolve(response.json()))
        })
      }
      
      export const post = (url: string, data) => {
        return new Promise((resolve) => {
          fetch(url,
            {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(handleErrors)
            .then(res => resolve(res.json()))
        })
      }
    `