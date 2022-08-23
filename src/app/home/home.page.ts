import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Message } from '../services/data.service';
import { Todo, TodoService } from '../services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  todos$: Todo[] = [];
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private todoService: TodoService, private data: DataService) { }

  submitForm(value: { title: string, completed: false }): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }

    value.completed = false;
    console.log("Submitted", value);
    this.todoService.create(value).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    });

    this.validateForm.reset();
  }
  ngOnInit(): void {
    this.todoService.findAll().then((res) => {
      this.todos$ = res.data;
    });
    this.validateForm = this.fb.group({
      title: [null, Validators.required]
    })
  }

  update = (todo) => {
    const updateTodo = Object.assign({}, todo);
    updateTodo.completed = !updateTodo.completed;
    console.log("Todo Updated", updateTodo);
    this.todoService.update(updateTodo).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    });
  }

  delete = (todo: Todo) => {
    console.log("Todo Deleted", todo);
    this.todoService.delete(todo.id).then(() => {
      this.todoService.findAll().then((res) => {
        this.todos$ = res.data;
      });
    });
  }

  refresh(ev) {
    this.todoService.findAll().then((res) => {
      this.todos$ = res.data;
      ev.detail.complete();
    });

  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

}
