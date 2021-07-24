import React from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="successScreen__section">
      <div className="successScreen__container container">
        <div className="successForm">
          <div className="successForm__svg">
            <svg
              width="84"
              height="92"
              viewBox="0 0 84 92"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.6544 90.7058C41.0019 91.4254 42.6931 91.4208 44.0406 90.7013C80.7623 70.9746 83.3702 32.4333 83.3381 21.4746C83.3346 20.5938 83.0743 19.7332 82.5891 18.9981C82.104 18.2629 81.4149 17.6853 80.6064 17.3358L43.7106 0.991668C43.1234 0.732845 42.4887 0.599556 41.847 0.600345C41.2053 0.601135 40.5709 0.735985 39.9844 0.996251L3.34518 17.3404C2.54858 17.6901 1.86929 18.2613 1.38822 18.9862C0.90716 19.711 0.644609 20.5589 0.631848 21.4288C0.476015 32.3325 2.67143 70.9563 39.6544 90.7058ZM26.7568 38.1763L37.2664 48.6858L56.9427 29.0096L63.4235 35.4904L37.2664 61.6475L20.276 44.6571L26.7568 38.1763Z"
                fill="#58B4AE"
              />
            </svg>
          </div>

          <div className="successForm__title">Success!</div>

          <div className="successForm__text">
            Your exchange order has been placed successfully and will be
            processed soon.
          </div>

          <div className="successForm__button">
            <Link to="/" style={{ textDecoration: "none" }}>
              <button data-hover="Thank you!">
                <div>Home</div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
