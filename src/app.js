import { HttpClient, json } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";

@inject(HttpClient)
export class App {
  
  constructor(httpClient) {
    this.heading = 'Todos';
    this.todos = [];
    this.todoDescription = '';
    this.httpClient = httpClient;
    this.httpClient.configure(config => {
      config
        .withBaseUrl('https://pubsub.googleapis.com/v1/projects/stellar-arcadia-205014/topics/')
        .withDefaults({
          credentials:'same-origin',
          headers: {
            'Authorization': 'Bearer ya29.Iq8BvQd66ZUD2pZkCFy3mlA7UNBqxrx1ocuttOEO2NfpTg4XBNzLTU9o_5Gybm79rXb89hcMYGqslaZqKxUfdMiZrnkBkpqEH8UV_E5juNTuMQ4zU5hTukLcp2SmpthAuAhKO7lnIT0wHE4Yi74ch4PdAkYG5Y6FZUGhS3Am2ojVNN0Gz5BxcwC_ZsiachGujjA1sRXOH48GNRMTn5NtTeYlzqn6-t3FQP1BH49jjDhf9A',
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

  addTodo() {
    if (this.todoDescription) {
      this.todos.push({
        description: this.todoDescription,
        done: false
      });
      this.todoDescription = '';
    }
  }

  removeTodo(todo) {
    let index = this.todos.indexOf(todo);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
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
      }
      this.httpClient
        .fetch("Rebu-test-topic:publish",{
          method: 'post',
          body: json(message)
          })
          .then(response => response.json())
          .then(savedComment => {
            alert('Saved comment! ID: ${savedComment.id}');
          })
          .catch(error => {
            alert('Error saving comment!');
    });
  }
}



