import { HttpClient, json } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";

@inject(HttpClient)
export class App {
  
  constructor(httpClient) {
    this.btnStr = 'Request REBU Driver';
    this.todos = [];
    this.todoDescription = '';
    this.httpClient = httpClient;
    this.httpClient.configure(config => {
      config
        .withBaseUrl('https://pubsub.googleapis.com/v1/projects/stellar-arcadia-205014/topics/')
        .withDefaults({
          credentials:'same-origin',
          headers: {
            'Authorization': 'Bearer ya29.Iq8BvQcNoMHuKCFqDjsNmc5FiJu_bSUyK6YXFfkTu_TBnsIX0Xcd_E5jaAhEu-W7C7VGJiVq8HXU-bwqCKPBnWFPusWZ24o1tiM_57dZkdUEE8dH5rU7XqwbC8k6EUcFkk1pZpBqzg3NZ6lg5SqM5i2I3y5ttn7croY_Ce-fza1WapJuBN1Q9Bzfecx_BYAm6GQ71CzUkLXy6396SPWHXY0UpWoP4a4X47foZ8853Kbqdw',
            'Accept' : 'application/json',
            'X-Requested-With' : 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }

  activate() {

  }

  publishMessage() {
      let message = {
        "messages": [
          {
            "attributes": {
              "key": "iana.org/language_tag",
              "value": "en"
            },
            "data": btoa("Hello, I want a ride pls")
          }
        ]
      };

      this.httpClient
        .fetch("Rebu-test-topic:publish",{
          method: 'post',
          body: json(message)
          })
          .then(response => response.json())
          .then(response => {
            this.btnStr = "REBU Driver Requested..."
          })
          .catch(error => {
            alert('Error saving comment!');
    });
  }
}



