import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
const { v1: uuidv1 } = require("uuid");

import "./styles/iconfont.css";
import "./styles/index.caaba7da.css";
import { ITodo } from "./types";
import Item from "./Item";
import dayjs from "dayjs";

function App() {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState<ITodo[]>([]);
  const Incomplete = useMemo(() => {
    //console.log("1");
    return todos.filter((todo) => !todo.finished);
  }, [todos]);
  const finished = useMemo(() => {
    //console.log("2");
    return todos.filter((todo) => todo.finished);
  }, [todos]);
  ////
  const getData = async () => {
    let _todos = await localStorage.getItem(localStorage.key(0));
    if (_todos) {
      try {
        let items: ITodo[] = await JSON.parse(_todos);
        //console.log(typeof(items))
        setTodos(items);
      } catch (error) {
        console.error("invalid cache");
      }
    }
  };

  React.useEffect(() => {
    getData();
  }, []);
  React.useEffect(() => {
    localStorage.setItem("_todos", JSON.stringify(todos));
  }, [todos]);
  /////

  const ChangeTodo = (todo: ITodo) => {
    const index = todos.indexOf(todo);
    todos[index].finished = !todos[index].finished;
    todos[index].mtime = dayjs().unix(); //修改时间
    setTodos([...todos]);
  };
  const DeleteTodo = (todo: ITodo) => {
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
    setTodos([...todos]);
  };
  return (
    <React.Fragment>
      <header>
        <div className="title">Todo List</div>
        <input
          className="input"
          type="text"
          placeholder="What needs to be done"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            //console.log("enter")
            //console.log(e.key)
            if (e.key === "Enter" && value.trim() !== "") {
              var todo: ITodo = {
                id: uuidv1(),
                content: value,
                finished: false,
                ctime: dayjs().unix(),
                mtime: dayjs().unix(),
              };
              //console.log(todos);
              todos.unshift(todo);
              setTodos([...todos]);
              //console.log(todos);
              setValue("");
            }
          }}
        />
      </header>
      <section>
        {Incomplete.map((todo) => (
          <Item
            key={todo.id}
            todo={todo}
            onFinish={() => ChangeTodo(todo)}
            onDelete={() => DeleteTodo(todo)}
          />
        ))}
        {finished.map((todo) => (
          <Item
            key={todo.id}
            todo={todo}
            onFinish={() => ChangeTodo(todo)}
            onDelete={() => DeleteTodo(todo)}
          />
        ))}
      </section>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
