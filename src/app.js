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
            'Authorization': 'Bearer ya29.Iq4BvQe3XEYfq_ndqn6eBVDJUKmkg4mBviqOu1Ep0_qaEOJ_10019GVb1n2T_0PdiSxsEZPq0Peu3FNjMCrwPjxUo9SaIhCdY3skaq5dXPvyPnLqPEDZMcpmQ0Nemg_6VsCklAvEPvFj_BwdUgoAQcbJsPPoGbW_CvkxFNvimp07gu2NYdjQMEgpz-BV6QFH5T-EWMBMZoY6N2FIe9frN5gZT3twrmJY0dkdmSu83m-f',
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



