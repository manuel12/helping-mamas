import "flowbite-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BoGButton from "../../../../components/BoGButton";
import SearchBar from "../../../../components/SearchBar";
import Text from "../../../../components/Text";
import {
  checkInVolunteer,
  checkOutVolunteer,
} from "../../../../queries/attendances";
import { getEvent, updateEvent } from "../../../../queries/events";
import { getUsers } from "../../../../queries/users";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
import AttendanceFunctionality from "./AttendanceFunctionality";

const Styled = {
  Container: styled.div`
    width: 90vw;
    max-width: 96rem;
    margin: 0 auto;
    padding: 2rem 0 0 0;
  `,
  Header: styled.h1`
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
    justify-content: space-between;
  `,
  CheckedInData: styled.p`
    margin: 0;

    font-size: 2rem;
    vertical-align: top;
  `,
  Search: styled.input`
    height: 3rem;
    width: 100%;
    margin: 0;
    padding: 0 0.5rem;

    font-size: 1rem;

    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
};

const EventAttendance = () => {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [event, setEvent] = useState({});
  const [minors, setMinors] = useState({});

  const [searchValue, setSearchValue] = useState("");

  const [waitingVolunteers, setWaitingVolunteers] = useState([]);
  const [checkedInVolunteers, setCheckedInVolunteers] = useState([]);
  const [checkedOutVolunteers, setCheckedOutVolunteers] = useState([]);

  useEffect(() => {
    (async () => {
      const eventResponse = await getEvent(eventId);
      setEvent(eventResponse.data.event);

      const waitingUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "waiting"
        )
      ).data.users;
      const checkedInUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "checkedIn"
        )
      ).data.users;
      const checkedOutUsers = (
        await getUsers(
          eventResponse.data.event.eventParent.organizationId,
          "volunteer",
          eventId,
          "checkedOut"
        )
      ).data.users;

      setWaitingVolunteers(waitingUsers);
      setCheckedInVolunteers(checkedInUsers);
      setCheckedOutVolunteers(checkedOutUsers);
    })();
  }, []);

  const checkIn = async (volunteer) => {
    await checkInVolunteer(
      volunteer._id,
      eventId,
      volunteer.organizationId,
      volunteer.firstName + " " + volunteer.lastName,
      volunteer.email,
      event.eventParent.title
    );

    setWaitingVolunteers(
      waitingVolunteers.filter((v) => v._id !== volunteer._id)
    );
    setCheckedInVolunteers(checkedInVolunteers.concat(volunteer));
    setCheckedOutVolunteers(
      checkedOutVolunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const checkOut = async (volunteer) => {
    await checkOutVolunteer(volunteer._id, eventId);

    setCheckedOutVolunteers((volunteers) => [...volunteers, volunteer]);
    setCheckedInVolunteers((volunteers) =>
      volunteers.filter((v) => v._id !== volunteer._id)
    );
  };

  const endEvent = () => {
    const newEvent = { ...event, isEnded: true };
    setEvent(newEvent);
    updateEvent(eventId, newEvent);
    checkedInVolunteers.forEach((v) => {
      checkOutVolunteer(v._id, eventId);
    });
    setCheckedOutVolunteers(checkedOutVolunteers.concat(checkedInVolunteers));
    setCheckedInVolunteers([]);
  };

  const reopenEvent = () => {
    const newEvent = { ...event, isEnded: false };
    setEvent(newEvent);
    updateEvent(eventId, newEvent);
  };

  const filteredAndSortedVolunteers = (volunteers) => {
    if (volunteers?.length === 0) return [];
    return (
      searchValue.length > 0
        ? volunteers.filter(
            (v) =>
              v.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
              v.firstName?.toLowerCase().includes(searchValue.toLowerCase())
          )
        : volunteers
    ).sort((a, b) =>
      a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0
    );
  };

  const convertTime = (time) => {
    if (!time) return "";
    let [hour, min] = time.split(":");
    let hours = parseInt(hour);
    let suffix = time[-2];
    if (!(suffix in ["pm", "am", "PM", "AM"])) {
      suffix = hours > 11 ? "pm" : "am";
    }
    hours = ((hours + 11) % 12) + 1;
    return hours.toString() + ":" + min + suffix;
  };

  return (
    <>
      <Styled.Container>
        <Text className="mb-4" href={`/events`} text="← Back to home" />
        <Styled.HeaderRow>
          <Styled.Header>Attendance Management</Styled.Header>
          {event.isEnded ? (
            <BoGButton text="Reopen Event" onClick={reopenEvent} />
          ) : (
            <BoGButton text="End Event" onClick={endEvent} />
          )}
        </Styled.HeaderRow>

        <div className="mx-18 mb-2 flex flex-col rounded-xl bg-grey px-6 py-3">
          <Text
            text={event?.eventParent?.title}
            type="header"
            className="mb-2 text-primaryColor"
          />
          <Text text="Date & Time:" className="font-bold" />
          <Text
            text={
              event?.date?.substring(0, 10) +
              ", " +
              convertTime(event?.eventParent?.startTime) +
              " - " +
              convertTime(event?.eventParent?.endTime)
            }
            className="mb-2"
          />
          <Text text="Address:" className="font-bold" />
          <Text
            text={
              event?.eventParent?.address +
              ", " +
              event?.eventParent?.city +
              ", " +
              event?.eventParent?.state +
              " " +
              event?.eventParent?.zip
            }
            className="mb-2"
          />

          <Text text="Description:" className="font-bold" />
          <div
            dangerouslySetInnerHTML={{
              __html: event?.eventParent?.description,
            }}
            className="h-24 overflow-hidden"
          />
          <Text
            className="mt-4"
            href={`/events/${eventId}`}
            text="See More Details"
          />
        </div>

        <div className="mx-18 my-8 flex flex-col rounded-xl bg-grey px-6 py-3">
          <SearchBar
            placeholder="Search by Volunteer Name or Email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <AttendanceFunctionality
            waitingVolunteers={filteredAndSortedVolunteers(waitingVolunteers)}
            checkedInVolunteers={filteredAndSortedVolunteers(
              checkedInVolunteers
            )}
            checkedOutVolunteers={filteredAndSortedVolunteers(
              checkedOutVolunteers
            )}
            minors={minors}
            checkIn={checkIn}
            checkOut={checkOut}
            isEnded={event?.isEnded}
          />
        </div>
      </Styled.Container>
      {/* <Footer endEvent={endEvent} reopenEvent={reopenEvent} event={event} /> */}
    </>
  );
};

export default AdminAuthWrapper(EventAttendance);
