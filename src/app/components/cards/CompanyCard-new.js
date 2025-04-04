import PropTypes from "prop-types";
import React from "react";
import "./companycard.css";
import Link from "next/link";

// //  <CardCompany
//               applyNowClassName="card-company-2"
//               className="card-company-instance"
//               company={company.name}
//               headerClassName="design-component-instance-node"
//               location={company.location}
//               property1="positions-open"
//               id={company.id}
//               status2={
//                 company.position_count
//                   ? company.position_count + " lediga positioner"
//                   : ""
//               }
//               showApply={company.position_count > 0 ? true : false}
//             />

export const CardCompany = ({
  showGreenIcon = true,
  showLogotype,
  location,
  company,
  showApply,
  statusProperty,
  className,
  headerClassName,
  applyNowClassName,
  companyPositions,
  id,
  logoUrl,
}) => {
  return (
    <Link href={`/companies/${id}`} className="card-link">
      <div className={`card-company ${statusProperty} ${className}`}>
        <div className="content">
          {showLogotype && (
            <img className="logotype" src={logoUrl} alt={`${company}-logo`} />
          )}

          <div className="text">
            {["internship-matching", "positions-open"].includes(
              statusProperty
            ) && (
              <div>
                <div className={`header ${headerClassName}`}>
                  <h5>{company}</h5>

                  <p>{location}</p>
                </div>

                <div className="frame">
                  {statusProperty === "internship-matching" && (
                    <p className="div">Matchar dig</p>
                  )}

                  {statusProperty === "positions-open" && (
                    <p>{companyPositions}</p>
                  )}

                  {showApply && (
                    <div className={`apply-now ${applyNowClassName}`}>
                      {showGreenIcon && <div className="rectangle" />}
                      <p className="text-wrapper-2">Ansök nu</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {statusProperty === "application-closed" && (
              <div className="header">
                <div className="company">{company}</div>

                <div className="location">{location}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

CardCompany.propTypes = {
  showGreenIcon: PropTypes.bool,
  statusClosed: PropTypes.string,
  companyPositions: PropTypes.string,
  showLogotype: PropTypes.bool,
  status: PropTypes.string,
  website: PropTypes.string,
  location: PropTypes.string,
  company: PropTypes.string,
  showApply: PropTypes.bool,
  logoUrl: PropTypes.string,
  id: PropTypes.number,
  statusProperty: PropTypes.oneOf([
    "application-closed",
    "positions-open",
    "internship-matching",
  ]),
};
