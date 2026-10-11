"use client";

import type {ButtonHTMLAttributes, MouseEvent} from "react";

export function ConfirmSubmitButton({message,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{message:string}){
  function confirmAction(event:MouseEvent<HTMLButtonElement>){
    if(!window.confirm(message)) event.preventDefault();
  }
  return <button {...props} onClick={confirmAction}/>;
}
