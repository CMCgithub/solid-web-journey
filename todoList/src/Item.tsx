import { ITodo } from "./types";
import React from "react";
import dayjs from "dayjs";

interface Props {
  todo: ITodo;
  onFinish: () => void
  onDelete: ()=>void
}

export default function Item(props: Props) {
  return (
    <div
      id={props.todo.id}
      className={props.todo.finished ? "todo-item todo-finished" : "todo-item"}
    >
      <i className="iconfont icon-checkbox" onClick={props.onFinish}></i>
      <span className="todo-title">{props.todo.content}</span>
      <span className="todo-time">
        {dayjs.unix(props.todo.ctime).format("MM月DD日HH:mm:ss")}
      </span>
      <i className="iconfont icon-delete" onClick={props.onDelete} ></i>
    </div>
  );
}
