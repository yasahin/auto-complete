import { clear } from "@testing-library/user-event/dist/clear";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import Car from "./Car.json";

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(false);
  const searchRef = useRef();

  const isTyping = search.replace(/\s+/, "").length > 0;
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
  const handleClickOutSide = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearch("");
    }
  };
  const getResultItem = (item) => {
    console.log(item);
  };
  useEffect(() => {
    if (isTyping) {
      const filteredResult = Car.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      setResult(filteredResult.length > 0 ? filteredResult : false);
    } else {
      setResult(false);
    }
    const getCar = setTimeout(() => {
      fetch(`/src/Car.json=${search}`)
        .then((res) => res.json())
        .then((Car) => setResult(Car));
    }, 500);
    return () => {
      clearTimeout(getCar);
    };
  }, [search]);

  return (
    <>
      <div className="search" ref={searchRef}>
        <input
          type="text"
          value={search}
          className={isTyping ? "typing" : null}
          placeholder="Bir şeyler ara..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {isTyping && (
          <div className="search-result">
            {result &&
              result.map((item) => (
                <div
                  onClick={() => getResultItem(item)}
                  key={item.id}
                  className="search-result-item"
                >
                  <img src={item.image} alt="" />
                  <div>
                    <div className="title">{item.title}</div>
                    <div className="date">{item.date}</div>
                  </div>
                </div>
              ))}
            {!result && (
              <div class="result-not-found">
                '{search}' ile ilgili bir şey bulamadık!
              </div>
            )}
          </div>
        )}
        <br />
        {search}
      </div>
    </>
  );
}

export default App;
