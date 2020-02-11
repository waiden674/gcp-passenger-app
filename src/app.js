import { HttpClient, json } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";

@inject(HttpClient)
export class App {
  
  constructor(httpClient) {
    this.buttonToggled = false;
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
            'Authorization': 'Bearer ya29.Iq8BvQfdhEYQ9Kg6MJgTIiaxNqD6o6RPBFfYXh8XASaYRSaprStfAhjoPtavvAPsAs-GZ1zwfw3C39tafvl1EZGLUFalnVfJT4Dc5bitOtWQyW4AZVeScc9_o5ZT2nxS4-lSvhfWerGN3JshBfxVzgSKfLS34WPlHnLNO7SO_dsFgJPhUzvAmabngIJnymQslp4rjzPv1e-ioVYIsvfMew3XkqM8Wked1-byeC7JKuEpyA',
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

  clickBtn(){
    if(!this.buttonToggled){
      this.buttonToggled = true;
      this.publishMessage()
    }else{
      this.buttonToggled = false;
      document.getElementById("message").style.visibility = "hidden";
      document.getElementById("button-icon").style.display = "inline";
      this.btnStr = "Request REBU Driver";
      document.getElementById("button").style.backgroundColor = "#FFB72E";
      this.pullMessage();
    }
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
            document.getElementById("message").style.visibility = "visible";
            document.getElementById("button-icon").style.display = "none";
            this.btnStr = "Cancel";
            document.getElementById("button").style.backgroundColor = "#d52b2b";
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



