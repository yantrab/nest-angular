
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
    