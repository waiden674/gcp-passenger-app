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
            'Authorization': 'Bearer ya29.Iq8BvQcvu4ymbxRaiyS_gxlFB23jgHS3al-2-hss1Ayijv7w3LltvVYE8mqd9Z2qY-tPkh1P3vdOGSAYpcxKCwuBatCjZr3pIHZfno5pVJ-rzYghACZwpkjM1Hl0hnCOR2ZhltBak33pM0vo9pIPNrw1M2mllEFrthPHuuMFWMM8we9qus00cZiIesufqi24O6BfYhaRj8jq3zpOh-G6y7BT4BOTVzhcjL6f0Y1HKzSJcA',
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
              "value": "en",
              "Type": "Request"
            },
            "data": btoa("Request"),
          }
        ]
      };

      this.httpClient
        .fetch("acme-rideshare-ride-requested-topic:publish",{
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

  expanded = false;
  open() {
    this.expanded = !this.expanded;
  }
}



