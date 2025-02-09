import { sendEventEmail } from "../../../src/utils/mailchimp-email.js";
import { getEventByID } from "../../actions/events";

// Handlers for email job definitions
export const emailHandler = {
  sendSurveyEmail: async (job) => {
    const { data: eventId } = job.attrs;

    // Need to retrieve updated event from database to get list of registered volunteers
    const event = await getEventByID(eventId);

    const emailTemplateVariables = [
      {
        name: "eventTitle",
        content: `${event.eventParent.title}`,
      },
    ];
    await sendEventEmail(event, "event-survey", emailTemplateVariables);
  },
};
