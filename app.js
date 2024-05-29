
Vue.component("my-todo-list", {

});

Vue.component("my-todo-item", {
  props: ['todo', 'index'],
  template: "#my-todo-item-template",
  methods: {
    deleteTodo: function (id, e) {
      if (e) {
        e.preventDefault();
      }
      if (confirm('Are you sure?')) {
        this.$emit("delete", id);
      }
    },
    onChecked: function (todo, value) {
      this.$emit("checked", {
        id: todo.id,
        todo: todo.todo,
        is_completed: value
      });
    }
  }
});

var tasksService = new LocalStorageService("tasks");


var myToDoApp = new Vue({
  el: "#my-todo",
  data: {
    total: 0,
    new_todo: '',
    show_new_todo_form: false,
    defaultlist: []
  },
  methods: {
    addNewTodo: function (e) {
      var todo = {
        todo: this.new_todo,
        is_completed: false
      };
      this.defaultlist.push(tasksService.create(todo));
      this.incrementTotal();
      this.new_todo = "";
    },
    incrementTotal: function () {
      this.total = this.total + 1;
    },
    deleteTodo: function (id) {
      tasksService.delete(id);
      this.defaultlist = this.defaultlist.filter(function (todo) {
        return todo.id != id;
      })
    },
    decrementTotal: function (id) {
      this.deleteTodo(id);
      this.total = this.total - 1;
    },
    onChecked: function (todo) {
      tasksService.update(todo);
    },
    deleteAll: function () {
      if (confirm('Are you sure?')) {
        tasksService.deleteAll();
        this.defaultlist = [];
        this.total = 0;
      }
    }
  },
  mounted: function () {
    var records = tasksService.getAll();
    this.defaultlist = records;
    this.total = this.defaultlist.length;
  },
  computed: {
    totalCompleted: function () {
      return this.defaultlist.filter(function (todo) {
        return todo.is_completed === true;
      }).length;
    }
  }
});