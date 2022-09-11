import { useSession } from "next-auth/react";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import * as Table from "../../sharedStyles/tableStyles";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
    color: #000;
    padding: 0;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.div`
    list-style-type: none;
    display: flex;
    flex-direction: column;
  `,
  List: styled.li`
    padding-bottom: 120px;
  `,
};

const convertTime = (time) => {
  let [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ["pm", "am", "PM", "AM"])) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};

const getMinorTotal = (minors) => {
  let total = 0;
  minors.forEach((minorObj) => {
    total += minorObj.minor.length;
  });
  return total;
};

const sliceEventDate = (dateNum) => {
  let eventDate = "";
  eventDate =
    dateNum.slice(5, 7) +
    "/" +
    dateNum.slice(8, 10) +
    "/" +
    dateNum.slice(0, 4);
  return eventDate;
};

const getDateMonth = (month) => {
  let convertMonth;
  switch (month) {
    case "Jan":
      convertMonth = "01";
      break;
    case "Feb":
      convertMonth = "02";
      break;
    case "Mar":
      convertMonth = "03";
      break;
    case "Apr":
      convertMonth = "04";
      break;
    case "May":
      convertMonth = "05";
      break;
    case "Jun":
      convertMonth = "06";
      break;
    case "Jul":
      convertMonth = "07";
      break;
    case "Aug":
      convertMonth = "08";
      break;
    case "Sep":
      convertMonth = "09";
      break;
    case "Oct":
      convertMonth = "10";
      break;
    case "Nov":
      convertMonth = "11";
      break;
    case "Dec":
      convertMonth = "12";
      break;
  }
  return convertMonth;
};

const compareDateString = (dateNum) => {
  let date = "";
  let dateArr = dateNum.split(" ");
  date = getDateMonth(dateArr[0]);
  date += "/" + dateArr[1];
  date += "/" + dateArr[2];
  return date;
};

const EventTable = ({
  dateString,
  events,
  onRegisterClicked,
  onUnregister,
  user,
}) => {
  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }
  return (
    <Styled.Container>
      <Styled.ul>
        {events.map((event) => (
          <Styled.List key={event._id}>
            <Link href={`events/${event._id}`}>
              <Table.EventList>
                <Table.Inner>
                  <Table.Register>
                    {event.volunteers.includes(user._id) ? (
                      <>
                        <Styled.Button onClick={() => onUnregister(event)}>
                          <Icon color="grey3" name="delete" />
                          <span>Unregister</span>
                        </Styled.Button>
                      </>
                    ) : (
                      <Styled.Button onClick={() => onRegisterClicked(event)}>
                        <Icon color="grey3" name="add" />
                        <span>Sign up</span>
                      </Styled.Button>
                    )}
                  </Table.Register>
                  <Table.TextInfo>
                    <Table.TitleAddNums>
                      <Table.EventName>{event.title}</Table.EventName>
                      <Table.Volunteers>
                        {sliceEventDate(event.date) <
                        compareDateString(dateString) ? (
                          <Table.Text>
                            <Table.Volunteers>
                              {event.volunteers.length +
                                getMinorTotal(event.minors)}
                            </Table.Volunteers>
                            <Table.Slots>Slots Available</Table.Slots>
                          </Table.Text>
                        ) : (
                          <Table.Text>
                            <Table.Volunteers>
                              {event.max_volunteers -
                                event.volunteers.length +
                                getMinorTotal(event.minors)}
                            </Table.Volunteers>
                            <Table.Slots>Volunteers Attended</Table.Slots>
                          </Table.Text>
                        )}
                        {/* {" "}
                        {event.max_volunteers -
                          event.volunteers.length +
                          getMinorTotal(event.minors)}{" "}
                        slots available */}
                      </Table.Volunteers>
                    </Table.TitleAddNums>
                    <Table.Time>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} EST
                    </Table.Time>
                  </Table.TextInfo>
                </Table.Inner>
                <Table.Creation>
                  {sliceEventDate(event.date)}
                  {/* {" "}
                  {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                  {event.date.slice(0, 4)}{" "} */}
                </Table.Creation>
              </Table.EventList>
            </Link>
          </Styled.List>
        ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.Array,
  onRegisterClicked: PropTypes.func,
  onUnregister: PropTypes.func,
  user: PropTypes.object,
};

export default EventTable;
