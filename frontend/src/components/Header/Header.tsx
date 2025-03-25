import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__list">
          <li className="header__item">
            <Link to="/shorten" className="header__link">
              Сократить
            </Link>
          </li>
          <li className="header__item">
            <Link to="/info" className="header__link">
              Инфо
            </Link>
          </li>
          <li className="header__item">
            <Link to="/analytics" className="header__link">
              Аналитика
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
