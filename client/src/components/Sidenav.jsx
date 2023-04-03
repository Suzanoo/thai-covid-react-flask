import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaBars, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { setQueryData } from '../features/dataService/dataSlice';
import logo from '../public/img/logo.png';

const options = ['new_case', 'total_case', 'new_death', 'total_death'];

function Sidenav() {
  const { isError, message } = useSelector((state) => state.queryData);
  const dispatch = useDispatch();

  const init = {
    cases: '',
    date: new Date(),
  };

  const [formData, setFormData] = useState(init);
  const menuIconEl = useRef(null);
  const sidenavEl = useRef(null);
  const sidenavCloseEl = useRef(null);

  const { cases, date } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message, dispatch]);

  const toggleClassName = (el, className) => {
    if (el.current.classList.contains(className)) {
      el.current.classList.remove(className);
    } else {
      el.current.classList.add(className);
    }
  };

  const handleMenuIconClick = () => {
    toggleClassName(sidenavEl, 'active');
  };

  const handleSidenavCloseClick = () => {
    toggleClassName(sidenavEl, 'active');
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({ ...prevState, date }));
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const query = {
      cases,
      date: date.toISOString().split('T')[0],
    };
    dispatch(setQueryData(query));
  };

  return (
    <>
      <div className="menu-icon" ref={menuIconEl} onClick={handleMenuIconClick}>
        <FaBars className="header__menu" />
      </div>
      <aside className="sidenav" ref={sidenavEl}>
        <div
          className="sidenav__close-icon"
          ref={sidenavCloseEl}
          onClick={handleSidenavCloseClick}
        >
          <FaTimes />

          {/* Cases */}
        </div>

        <section className="sidenav-form">
          <img src={logo} alt="" className="ml-4" />
          <hr></hr>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="difficulty">Cases</label>
              <select name="cases" value={cases} onChange={onChange}>
                <option value="">--Choose...--</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="startDates">Date</label>
              <DatePicker
                selected={date}
                name="date"
                value={date}
                onChange={handleDateChange}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy/MM/dd"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-block">
                Submit
              </button>
            </div>
          </form>
        </section>
      </aside>
    </>
  );
}

export default Sidenav;
