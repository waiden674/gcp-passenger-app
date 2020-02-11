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
        .withBaseUrl('https://pubsub.googleapis.com/v1/projects/stellar-arcadia-205014/')
        .withDefaults({
          credentials:'same-origin',
          headers: {
            'Authorization': 'Bearer ya29.Iq8BvQf-zcFf0tm-zJgavtQWPfzhP48BECopxe_ijavqrUFM6tJ6fkriA0YV8d7Yd6keqjIsrMJ1mHNqTlihN0QjG31wDV0KB07i-pnjKO3z7I_TlhwZPFUJFCCKfdPyvwGxrxn-me_0MH8njdve-WxllUgQBNpYt0y9hr9Iy5J97L-_KzxaUFVDMHs2RJnfPMz8YECdBq1Yt3xUegi9MG7-LyfZWfVpyjr2obx4mcA_8Q',
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
    this.pullMessage();
  }

  publishMessage() {
      let message = {
        "messages": [
          {
            "attributes": {
              "key": "iana.org/language_tag",
              "value": "en",
              "passengerName":"Jack",
              "requestType":"ride request",
              "msg":"I need a rideshare."
            },
            "data": "ewoJInBhc3Nlbmdlck5hbWUiOiJKYWNrIiwKCSJyZXF1ZXN0VHlwZSI6InJpZGUgcmVxdWVzdCIsCgkibXNnIjoiSSBuZWVkIGEgcmlkZXNoYXJlLiIKfQ==",
          }
        ]
      };

      this.httpClient
        .fetch("topics/acme-rideshare-ride-requested-topic:publish",{
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

  pullMessage(){
    let message = {
      "returnImmediately" : false,
      "maxMessages": 10
    };
    this.httpClient
      .fetch("subscriptions/acme-rideshare-ride-accepted-subscription:pull",{
        method: 'post',
        body: json(message)
      })
      .then(response => {
        response.json().then(data => {
          if(data.receivedMessages){
            this.acknowledge(data.receivedMessages[0].ackId);
            //Do Something cool
            
          }else{
            console.log("Pulling Again")
            this.pullMessage()
          }
        })
      })
      
  }

  acknowledge(ackId){
    console.log("acknowledged ID: "+ ackId)
    let message = {
      "ackIds": [ackId]
    }
    this.httpClient
      .fetch("subscriptions/acme-rideshare-ride-accepted-subscription:acknowledge",{
        method: 'post',
        body: json(message)
      })
  }
}



