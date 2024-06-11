
// useApi.js
import { useState } from 'react';
import { Share } from 'react-native';

// const useApi = () => {
//   // const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async (endpoint, method, data = null) => {
//     // setLoading(true);
//     setError(null);
//     let url = 'https://www.truehomes24.com/api/' + endpoint;
//     try {
//       var myHeaders = new Headers();
//       const response = await fetch(url, {
//         method: method,
//         // headers: {
//         //     'Content-Type': 'application/json',
//         //     // Add any additional headers if needed
//         //   },
//         headers: myHeaders,
//         body: data ? JSON.stringify(data) : null,
//         // body: data ? data : null,
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const responseData = await response.json();
//       // setLoading(false);
//       return responseData;
//     } catch (error) {

//       console.log('err apiconfig.....', error);
//       setError(error.message);
//       return error;
//       // setLoading(false);
//     }
//   };

//   return { fetchData, error };
// };

// export default useApi;

const UseApi = () => {
  const BASE_URL = 'https://www.jobtrigger.in/api/';

  // const FetchData = async (endpoint, method, data = null) => {
  //   let url = BASE_URL + endpoint;
  //   console.log('data.....api..', data);
  //   const formdata = new FormData();
  //   if (data && method == 'POST') {
  //     for (const name in data) {
  //       console.log('data[name]...', data[name]);
  //       formdata.append(name, data[name]);
  //     }

  //     console.log('formdata...', formdata);
  //   }

  //   try {
  //     var myHeaders = new Headers();
  //     // myHeaders.append("Authorization", "Bearer null");
  //     // myHeaders.append("Content-Type", 'application/json');
  //     // myHeaders.append("Content-Type", 'multipart/form-data');
  //     const response = await fetch(url, {
  //       method: method,
  //       // headers: {
  //       //     'Content-Type': 'application/json',
  //       //     // "Authorization": "Bearer "
  //       //     // Add any additional headers if needed
  //       //   },
  //       headers: myHeaders,
  //       // credentials: 'include',
  //       // mode: "no-cors",
  //       // redirect: "follow",
  //       // body: data ? JSON.stringify(data) : null,
  //       body: method == 'POST' ? formdata : data ? JSON.stringify(data) : null,
  //     });

  //     // console.log('response...', response);
  //     if (!response.ok) {
  //       throw new Error('Network response was  ok');
  //     }

  //     const responseData = await response.json();
  //     // setLoading(false);
  //     return responseData;
  //   } catch (error) {

  //     console.log('err apiconfig.....', error);
  //     return error;
  //     // setError(error.message);
  //     // setLoading(false);
  //   }
  // };

  const Request = async (endpoint, method = 'GET', params = null) => {

    var xmlRequest = new XMLHttpRequest();
    // xmlRequest.withCredentials = true;
    let url = BASE_URL + endpoint;

    return new Promise((resolve, reject) => {
      xmlRequest.open(method, url, true);

      // xmlRequest.setRequestHeader('Accept', '*/*');
      xmlRequest.setRequestHeader("X-API-Key", "5d41402abc4b2a76b9719d911017c592");
      // xmlRequest.setRequestHeader('Content-Type', 'application/json');
      // xmlRequest.setRequestHeader('Content-Type', 'multipart/form-data');
      // console.log('token....', token);
      // xmlRequest.setRequestHeader('Authorization', 'Bearer ' + token);

      if (method == 'GET') {
        xmlRequest.send();
      } else {
        console.log('params....', params)
        // xmlRequest.send(JSON.stringify(params));
        let formdata = new FormData();
        let data = params;
        for (const name in data) {
          // console.log('data[name]...', data[name]);
          formdata.append(name, data[name]);
          // formdata.append(name,'');
          // console.log('formdata...', formdata);
        }
        xmlRequest.send(formdata);
      }

      xmlRequest.onreadystatechange = function () { // Call a function when the state changes.   
        // console.log("xmlRequest.response", xmlRequest.response)
        if (xmlRequest.readyState === XMLHttpRequest.DONE) {
          let resultData = JSON.parse(xmlRequest.response);
          if (xmlRequest.status === 200) {
            resolve(resultData);
          } else {
            try {
              let result = JSON.parse(xmlRequest.response);
              console.log('input param data...', params);
              console.log('result.error...', result.error);
              // if (result.error == 'Invalid Token.') {
              //    NavigationService.navigate('Logout');
              // }
              reject(result);
            } catch (err) {
              reject({ error: 'Server Error Please try again later !!!', actError: err });
              console.log('err......', err);
            }
          }
        }
      }
    })
  }

  const shareLink = async (endpoint) => {
     const baseurl = 'https://www.jobtrigger.in/';
    try {
        const result = await Share.share({
            message: `Check out this link: ${baseurl}${endpoint}`,
            url: `${baseurl}${endpoint}`, // URL can be included in the message itself
            title: 'Share via'
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // Shared with activity type of result.activityType
                console.log('Shared with activity type:', result.activityType);
            } else {
                // Shared
                console.log('Link shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            // Dismissed
            console.log('Share dismissed');
        }
    } catch (error) {
        console.error('Error sharing link:', error.message);
    }
};

  return {Request,shareLink };
};

export default UseApi;

