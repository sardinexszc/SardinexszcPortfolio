"use client";

import { useState } from "react";

// The two password inputs of the setPassword form, with one show/hide toggle for both.
export function PasswordFields() {
  const [visible, setVisible] = useState(false);
  const type = visible ? "text" : "password";
  return (
    <>
      <label htmlFor="new-password">New password</label>
      <input id="new-password" name="password" type={type} autoComplete="new-password" minLength={12} required aria-describedby="password-rules" />
      <label htmlFor="confirm-password">Confirm password</label>
      <input id="confirm-password" name="confirmation" type={type} autoComplete="new-password" minLength={12} required aria-describedby="password-rules" />
      <label className="cms-check db-show-password"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /> Show passwords</label>
    </>
  );
}
