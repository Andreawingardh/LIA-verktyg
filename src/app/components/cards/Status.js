import PropTypes from "prop-types";
import React from "react";
import "./companycard.css";

export const Status = ({ showApplyNow = true, property1 }) => {
  return (
    <div className={`status ${property1}`}>
      <div className="matchar-dig">
        {property1 === "default" && <>Matchar dig</>}

        {property1 === "positions-open" && <></>}

        {property1 === "closed" && <>Ansökan stängd</>}
      </div>
    </div>
  );
};

Status.propTypes = {
  showApplyNow: PropTypes.bool,
  property1: PropTypes.oneOf(["closed", "positions-open", "default"]),
};