/* Bible to typescript
 *
const foo: string = "bar";
var container = document.getElementById('container');
function Counter(el: HTMLElement) {
  this.count = 0;
  el.innerHTML = this.count;
  el.addEventListener('click', () => { // fat arrow a.k.a lambdas
    this.count += 1;
    el.innerHTML = this.count;
  });
}
Counter(container);

// more lambdas
var nums = [1,2,3];
var filtered = nums.filter( function(x){ return x > 1 });
var filtered = [1,2,3].filter( x => x > 1 );

// spread operator
function add(...values: any[]){
  let total = 0;
  for(var value of values){
    total += value;
  }
  return total;
}
add(1,2,3,4);
var source = [3,4,5];
var target = [1,2, ...source, 6];

// enum
enum TodoState {
  New = 1,
  Active,
  Complete,
  Deleted
}
// interface
interface Todo {
  name: string;
  state: TodoState;
}
var todo: Todo = {
  name: "Dry cleaning",
  state: TodoState.Complete
}
function del(todo: Todo){
  if (todo.state != TodoState.Complete) {
    throw "Can't delete incomplete todo";
  }
}

// class
class TodoStateChanger {
  constructor(private newState: TodoState) {}
  canChangeState(todo: Todo): boolean {
    return !!todo;
  }
  changeState(todo: Todo): Todo {
    if(this.canChangeState(todo)) {
      todo.state = this.newState;
    }
  }
}
// class extension
class CompleteTodoStateChanger extends TodoStateChanger {
  constructor() {
    super(TodoState.Complete);
  }
  canChangeState(todo: Todo): boolean {
    return super.canChangeState(todo) && (
      todo.state == TodoState.Active ||
      todo.state == TodoState.Deleted
    )
  }
}

// template strings
container.innerHTML = `<div class='list-group-item'>
  <i class=${ TodoState.Complete ? "hidden" : ""}></i>
  <span>${todo.name}</span>
</div>`;
*/