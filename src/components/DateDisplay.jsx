import React from "react";
import PropTypes from "prop-types";

class DateDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { month: "Jan", day: "1" };
  }

  componentDidMount = () => {
    // add the timezone offset for events
    let date = new Date(this.props.date);
    date = new Date(
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    );
    const month = date.toLocaleString("default", { month: "short" });
    this.setState({ month: month, day: date.getDate() });
  };

  render() {
    return this.props.version === "Primary" ? (
      <div className="mr-2 flex h-16 w-16 flex-col items-center justify-center rounded-md bg-primaryColor">
        <p className="mb-0 mt-3 text-sm leading-none text-white">
          {this.state.month.toUpperCase()}
        </p>
        <p className="mt-1 text-3xl font-bold leading-none text-white">
          {this.state.day}
        </p>
      </div>
    ) : (
      <div className="mr-2 flex h-16 w-16 flex-col items-center justify-center rounded-md bg-secondaryColor">
        <p className="mb-0 mt-3 text-sm leading-none text-primaryColor">
          {this.state.month.toUpperCase()}
        </p>
        <p className="mt-1 text-3xl font-bold leading-none text-primaryColor">
          {this.state.day}
        </p>
      </div>
    );
  }
}

export default DateDisplayComponent;

DateDisplayComponent.propTypes = {
  date: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
};
