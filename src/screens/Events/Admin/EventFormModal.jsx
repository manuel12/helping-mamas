import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Input,
  Col,
  Row,
} from "reactstrap";
import { Formik, Form as FForm, Field, ErrorMessage } from "formik";
import * as SForm from "../../sharedStyles/formStyles";
import PropTypes from "prop-types";
import { groupEventValidator, standardEventValidator } from "./eventHelpers";
import { editEvent } from "../../../actions/queries";
import { createEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import "react-quill/dist/quill.snow.css";

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  FifthCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 20%;
  `,
  ThirdCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 33%;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  GenericText: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const EventFormModal = ({ toggle, event, han, isGroupEvent }) => {
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);

  const onSubmitCreateEvent = (values, setSubmitting) => {
    const event = {
      ...values,
      description: content,
      isPrivate: isGroupEvent ? "true" : "false",
    };
    setSubmitting(true);
    createEvent(event)
      .then(() => toggle())
      .catch(console.log)
      .finally(() => setSubmitting(false));
  };

  const onSubmitEditEvent = (values, setSubmitting) => {
    const editedEvent = {
      ...values,
      description: content,
      _id: event._id,
    };
    setSubmitting(true);
    editEvent(editedEvent, sendConfirmationEmail);
    toggle();
  };

  const containsExistingEvent = (event) => {
    return event;
  };

  const onSendConfirmationEmailCheckbox = () => {
    setSendConfirmationEmail(true);
  };

  const getLocalTime = () => {
    return new Date()
      .toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "short" })
      .substring(4);
  };

  const emptyStringField = "";
  const submitText = containsExistingEvent(event) ? "Submit" : "Create Event";
  const [content, setContent] = useState(
    containsExistingEvent(event) ? event.description : emptyStringField
  );

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  return (
    <Formik
      initialValues={{
        title: containsExistingEvent(event) ? event.title : emptyStringField,
        date: containsExistingEvent(event)
          ? event.date.split("T")[0]
          : emptyStringField, // strips timestamp
        startTime: containsExistingEvent(event)
          ? event.startTime
          : emptyStringField,
        endTime: containsExistingEvent(event)
          ? event.endTime
          : emptyStringField,
        localTime: containsExistingEvent(event)
          ? event.localTime
          : getLocalTime(),
        address: containsExistingEvent(event)
          ? event.address
          : emptyStringField,
        city: containsExistingEvent(event) ? event.city : emptyStringField,
        state: containsExistingEvent(event) ? event.state : "GA",
        zip: containsExistingEvent(event) ? event.zip : emptyStringField,
        max_volunteers: containsExistingEvent(event)
          ? event.max_volunteers
          : emptyStringField,
        description: containsExistingEvent(event)
          ? event.description
          : emptyStringField,

        // TODO: add default values for these
        eventContactPhone: containsExistingEvent(event)
          ? event.eventContactPhone
          : emptyStringField,
        eventContactEmail: containsExistingEvent(event)
          ? event.eventContactEmail
          : emptyStringField,

        pocName:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocName
            : emptyStringField,
        pocEmail:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocEmail
            : emptyStringField,
        pocPhone:
          containsExistingEvent(event) && isGroupEvent
            ? event.pocPhone
            : emptyStringField,
        orgName:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgName
            : emptyStringField,
        orgAddress:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgAddress
            : emptyStringField,
        orgCity:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgCity
            : emptyStringField,
        orgState:
          containsExistingEvent(event) && isGroupEvent ? event.orgState : "GA",
        orgZip:
          containsExistingEvent(event) && isGroupEvent
            ? event.orgZip
            : emptyStringField,
        isPrivate: isGroupEvent ? "true" : "false",
      }}
      onSubmit={(values, { setSubmitting }) => {
        containsExistingEvent(event)
          ? onSubmitEditEvent(values, setSubmitting)
          : onSubmitCreateEvent(values, setSubmitting);
      }}
      validationSchema={
        isGroupEvent ? groupEventValidator : standardEventValidator
      }
      render={({
        handleSubmit,
        isValid,
        isSubmitting,
        values,
        setFieldValue,
        handleBlur,
      }) => (
        <React.Fragment>
          <Styled.ModalBody>
            <Styled.Form>
              <SForm.FormGroup>
                <Row>
                  <Col>
                    <Row
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Information
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Title</SForm.Label>
                        <Styled.ErrorMessage name="title" />
                        <Field name="title">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.ThirdCol>
                        <SForm.Label>Max Volunteers</SForm.Label>
                        <Styled.ErrorMessage name="max_volunteers" />
                        <Field name="max_volunteers">
                          {({ field }) => (
                            <SForm.Input {...field} type="number" />
                          )}
                        </Field>
                      </Styled.ThirdCol>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Date</SForm.Label>
                        <Styled.ErrorMessage name="date" />
                        <Field name="date">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Start Time</SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>End Time</SForm.Label>
                        <Field name="endTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                    <Row
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Location
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Address</SForm.Label>
                        <Styled.ErrorMessage name="address" />
                        <Field name="address">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>City</SForm.Label>
                        <Styled.ErrorMessage name="city" />
                        <Field name="city">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.FifthCol>
                        <SForm.Label>State</SForm.Label>
                        <Styled.ErrorMessage name="state" />
                        <Field name="state">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.FifthCol>
                      <Styled.ThirdCol>
                        <SForm.Label>Zip Code</SForm.Label>
                        <Styled.ErrorMessage name="zip" />
                        <Field name="zip">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.ThirdCol>
                    </Row>
                    <Row
                      style={{
                        // paddingLeft: "5.2rem",
                        padding: "5px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Event Contact
                    </Row>
                    <Row>
                      <Styled.Col>
                        <SForm.Label>Phone Number</SForm.Label>
                        <Styled.ErrorMessage name="eventContactPhone" />
                        <Field name="eventContactPhone">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                      <Styled.Col>
                        <SForm.Label>Email Address</SForm.Label>
                        <Styled.ErrorMessage name="eventContactEmail" />
                        <Field name="eventContactEmail">
                          {({ field }) => (
                            <SForm.Input {...field} type="text" />
                          )}
                        </Field>
                      </Styled.Col>
                    </Row>
                  </Col>
                  {isGroupEvent && (
                    <Col>
                      <Row
                        style={{
                          marginLeft: "0.5rem",
                          padding: "5px",
                        }}
                      >
                        <SForm.Label>Organization Information</SForm.Label>
                      </Row>
                      <div
                        style={{
                          backgroundColor: "#F4F4F4",
                          marginLeft: "1rem",
                          marginRight: "-2rem",
                          padding: "1rem",
                          paddingLeft: "1rem",
                        }}
                      >
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Name</SForm.Label>
                            <Styled.ErrorMessage name="orgName" />
                            <Field name="orgName">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Address</SForm.Label>
                            <Styled.ErrorMessage name="orgAddress" />
                            <Field name="orgAddress">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>City</SForm.Label>
                            <Styled.ErrorMessage name="orgCity" />
                            <Field name="orgCity">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.FifthCol>
                            <SForm.Label>State</SForm.Label>
                            <Styled.ErrorMessage name="orgState" />
                            <Field name="orgState">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.FifthCol>
                          <Styled.ThirdCol>
                            <SForm.Label>Zip Code</SForm.Label>
                            <Styled.ErrorMessage name="orgZip" />
                            <Field name="orgZip">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                          </Styled.ThirdCol>
                        </Row>
                        <Row
                          style={{
                            padding: "5px",
                            fontWeight: "bold",
                            color: "gray",
                          }}
                        >
                          <Styled.Col>Point of Contact</Styled.Col>
                          &nbsp;
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Name</SForm.Label>
                            <Styled.ErrorMessage name="pocName" />
                            <Field name="pocName">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                          <Styled.Col>
                            <SForm.Label>Phone Number</SForm.Label>
                            <Field name="pocPhone">
                              {({ field }) => (
                                <SForm.Input {...field} type="number" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                        <Row>
                          <Styled.Col>
                            <SForm.Label>Email Address</SForm.Label>
                            <Field name="pocEmail">
                              {({ field }) => (
                                <SForm.Input {...field} type="text" />
                              )}
                            </Field>
                          </Styled.Col>
                        </Row>
                      </div>
                    </Col>
                  )}
                </Row>
                <Row
                  style={{
                    marginRight: "-2rem",
                  }}
                >
                  <Styled.Col>
                    <SForm.Label>Description</SForm.Label>
                    <Styled.ErrorMessage name="description" />
                    <Field name="description">
                      {() => (
                        <ReactQuill
                          value={content}
                          onChange={(newValue) => {
                            setContent(newValue);
                          }}
                          ref={quill}
                        />
                      )}
                    </Field>
                  </Styled.Col>
                </Row>
              </SForm.FormGroup>
            </Styled.Form>
            {containsExistingEvent(event) && (
              <Styled.Row>
                <FormGroup>
                  <Input
                    type="checkbox"
                    onChange={onSendConfirmationEmailCheckbox}
                  />
                  {""}
                </FormGroup>
                <Styled.GenericText>
                  I would like to send a confirmation email
                </Styled.GenericText>
              </Styled.Row>
            )}
          </Styled.ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={toggle}
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                color: variables["event-text"],
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              style={{
                backgroundColor: "ef4e79",
                borderColor: "ef4e79",
                // backgroundColor: variables["button-pink"],
                // borderColor: variables["button-pink"],
                marginLeft: "4rem",
              }}
            >
              {submitText}
            </Button>
          </ModalFooter>
        </React.Fragment>
      )}
    />
  );
};

EventFormModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventFormModal;
