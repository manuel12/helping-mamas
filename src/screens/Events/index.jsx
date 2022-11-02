import { useSession } from "next-auth/react";
import React from "react";
import EventManager from "./EventManager";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  return <EventManager user={user} role={user.role} />
};

export default EventManagerSelector;
