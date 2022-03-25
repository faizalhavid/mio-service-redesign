import * as AddCalendarEvent from "react-native-add-calendar-event";

const eventConfig = {
  title: "Mio Title",
  // and other options
};

export const addToCalendar = (title: any, startDate: string) => {
  let endDate = new Date(
    new Date(startDate).setHours(new Date(startDate).getHours() + 4)
  ).toISOString();
  AddCalendarEvent.presentEventCreatingDialog({
    title,
    startDate,
    endDate,
  })
    .then((eventInfo) => {
      // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
      // These are two different identifiers on iOS.
      // On Android, where they are both equal and represent the event id, also strings.
      // when { action: 'CANCELED' } is returned, the dialog was dismissed
      console.log(JSON.stringify(eventInfo));
    })
    .catch((error: string) => {
      // handle error such as when user rejected permissions
      console.log(error);
    });
};
