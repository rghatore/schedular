import React, { useState } from "react";

import Button from "../Button";
import InterviewerList from "../InterviewerList";

function Form(props) {

  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);

  function reset() {
    setName("");
    setInterviewer(null);
    // return
  }

  function cancel() {
    reset();
    return props.onCancel();
  }

  function save() {
    return props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()} >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          /*
            This must be a controlled component
          */
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          {/* {console.log("props.onSave: ", props.onSave)} */}
          {/* {console.log("name: ", name)} */}
          {/* {console.log("interviewer: ", interviewer)} */}
          <Button onClick={save} confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}

export default Form;