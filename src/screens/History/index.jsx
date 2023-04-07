import { Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getHistoryEvents } from "../../queries/historyEvents";
import { getUsers } from "../../queries/users";
import SearchBar from "../../components/SearchBar";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";

const Styled = {
  Container: styled.div`
    width: 90vw;
    max-width: 96rem;
    margin: 0 auto;
    padding: 2rem 0 0 0;
  `,
  Header: styled.h1`
    margin: 0;

    font-size: 3rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
    justify-content: space-between;
  `,
};

const History = () => {
  const {
    data: { user },
  } = useSession();

  const [searchValue, setSearchValue] = useState("");
  const [historyEvents, setHistoryEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedHistoryEvents = (
        await getHistoryEvents({ organizationId: user.organizationId })
      ).data.historyEvents;
      const admins = (await getUsers(user.organizationId, "admin")).data.users;
      const mappedHistoryEvents = await Promise.all(
        fetchedHistoryEvents.map(async (event) => {
          const matchedAdmin = admins.find(
            (element) => element._id === event.userId
          );
          return {
            ...event,
            firstName: matchedAdmin?.firstName ?? "Unknown",
            lastName: matchedAdmin?.lastName ?? "Admin",
          };
        })
      );
      setHistoryEvents(mappedHistoryEvents);
    })();
  }, []);

  const filteredAndSortedHistoryEvents = () => {
    return (
      searchValue.length > 0
        ? historyEvents.filter(
            (h) =>
              h.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              h.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              (h.firstName + " " + h.lastName)
                ?.toLowerCase()
                .trim()
                .includes(searchValue.toLowerCase().trim()) ||
              h.description
                ?.toLowerCase()
                .trim()
                .includes(searchValue.toLowerCase().trim())
          )
        : historyEvents
    ).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  };

  return (
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>History</Styled.Header>
      </Styled.HeaderRow>

      <SearchBar
        placeholder="Search by Admin Name or Actions"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Change Description</Table.HeadCell>
          <Table.HeadCell>Time</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredAndSortedHistoryEvents().map((event, index) => (
            <Table.Row key={index} evenIndex={index % 2 === 0}>
              <Table.Cell>
                {event.firstName} {event.lastName}
              </Table.Cell>
              <Table.Cell>{event.description}</Table.Cell>
              <Table.Cell>
                {new Date(event.createdAt).toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Styled.Container>
  );
};

History.propTypes = {
  historyEvents: PropTypes.array,
};

export default AdminAuthWrapper(History);
