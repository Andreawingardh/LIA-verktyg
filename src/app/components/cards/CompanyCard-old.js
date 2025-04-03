import PropTypes from "prop-types";
import React from "react";
import { Status } from "./Status";
import "./companycard.css";
import Link from "next/link";

export const CardCompany = ({
  showGreenIcon = true,
  statusClosed = "Ansökan stängd",
  status2,
  showLogotype = true,
  status = "Matchar dig",
  location = "Göteborg",
  company = "Acme Agency",
  website,
  id,
  showApply = true,
  property1,
  className,
  headerClassName,
  applyNowClassName,
}) => {
  return (
    <div className={`card-company ${property1} ${className}`}>
        <div className="content">
          {showLogotype && <div className="logotype" />}

          <div className="text">
            {["internship-matching", "positions-open"].includes(property1) && (
              <>
                <div className={`header ${headerClassName}`}>
                  <p>{company}</p>

                  <p>{location}</p>
                </div>

                <div className="frame">
                  {property1 === "internship-matching" && (
                    <div className="div-wrapper">
                      <p className="div">Matchar dig</p>
                    </div>
                  )}

                  {property1 === "positions-open" && (
                    <Status property1="positions-open" />
                  )}

                  {showApply && (
                    <div className={`apply-now ${applyNowClassName}`}>
                      <p>{status2}</p>
                      {showGreenIcon && <div className="rectangle" />}
                      <p className="text-wrapper-2">Ansök nu</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {property1 === "application-closed" && (
              <div className="header">
                <div className="acme-agency">{company}</div>

                <div className="g-teborg">{location}</div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

CardCompany.propTypes = {
  showGreenIcon: PropTypes.bool,
  statusClosed: PropTypes.string,
  status2: PropTypes.string,
  showLogotype: PropTypes.bool,
  status: PropTypes.string,
  website: PropTypes.string,
  location: PropTypes.string,
  company: PropTypes.string,
  showApply: PropTypes.bool,
  property1: PropTypes.oneOf([
    "application-closed",
    "positions-open",
    "internship-matching",
  ]),
};
