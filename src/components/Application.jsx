import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
const axios = require("axios");

export default function Application(props) {
  
  // let [day, setDay] = useState("Monday");
  // let [days, setDays] = useState([]);
  // let [appointments, setAppointments] = useState({});
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  let dailyAppointments = [];

  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}));

  function bookInterview(id, interview) {
    // console.log("bookInterview: ", id, interview);
    
    // put request to udpate the database
    return axios.put(
      `/api/appointments/${id}`,
      {interview: {...interview}}
    ).then(() => {
      // console.log("UDPATED!")
      // copying appointment object at particular id
      // replacing interview null to interview with data
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      // copying appointmentS object and updating with new appointment data
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      // set new state
      setState({...state, appointments});
    }).catch(error => console.log(error.message)) 
  }

  function cancelInterview(id) {
    // console.log("Cancel this id: ", id);
    // axios request to delete
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      }
      const appointments = {
        ...state.appointments,
        [id]: appointment
      }
      setState({...state, appointments})
    }).catch(error => console.log(error.message))
  }

  function interviewSpots (bookings) {
    return bookings.map((booking) => { 
      const interview = getInterview(state, booking.interview);
      // console.log("interview: ", interview);
      // console.log("booking: ", booking);
      const appointment = {...booking, interview: interview}
      // console.log("appointment: ", appointment);
      return (
        <Appointment
        key={appointment.id}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        interviewers ={getInterviewersForDay(state, state.day)}
        {...appointment}
        />
        )
    })
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  },[])

  dailyAppointments = getAppointmentsForDay(state, state.day);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
        {interviewSpots(dailyAppointments)}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}


