import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem("Drink Cofee"),
      this.createTodoItem("Make Awesome App"),
      this.createTodoItem("Have a lunch")
    ],
    search: '',
    status: 'all'
  };


  createTodoItem(label){
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  deleteItem = (id) =>{
    this.setState(({todoData})=> {
      const idx = todoData.findIndex((el)=> el.id === id);
      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];      
      return {
        todoData: newArray
      };
    });
  };

  addItem = (text) =>{
     const newItem = this.createTodoItem(text)

     this.setState(({todoData})=>{
        const newArray = [ ...todoData, newItem];

        return {
          todoData: newArray
        }
     })
  }

  
  toggleProperty (arr, id, propName){
    const idx = arr.findIndex((el)=> el.id === id);

      const oldItem = arr[idx];
      const newItem = {...oldItem, [propName]: !oldItem[propName]}

      return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)]; 
  }

  onToggleDone = (id) => {
    this.setState(({todoData})=>{
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    });
  };

  onToggleImportant = (id) => {
    this.setState(({todoData})=>{
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    });
  };

  onSearch = (text) => { 
    this.setState({
      search: text
    });
  }

  onStatusToggle = (status) => {
    this.setState({ status });
  }

  search(items, search){
    return items.filter(({label}) => label.toLowerCase().includes(search.toLowerCase()))
  }

  filterStatus(items, status){

    switch(status){
      case 'all':
        return items;
      case 'done':
        return items.filter((item) => item.done);
      case 'active':
        return items.filter((item) => !item.done);
      default:
        return items;
    }
  }

  render(){

    const {todoData, search, status} = this.state;

    const visibleItems = this.filterStatus(this.search(todoData, search), status);    

    const doneCount = todoData.filter((el) => el.done).length;    
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearch={this.onSearch} value={search}/>
          <ItemStatusFilter filter={status} onStatusToggle={this.onStatusToggle} />
        </div>  
        <TodoList 
        todos={visibleItems}
        onDeleted ={this.deleteItem}
        onToggleImportant={this.onToggleImportant}
        onToggleDone={this.onToggleDone}/>

        <ItemAddForm onItemAdded={this.addItem}/>
      </div>
    );
  };  
};