/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";
import NoteItem from "../components/NoteItem.jsx";

const Notes = ({ notes }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [text, setText] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [sortOrder, setSortOrder] = useState("latest"); // NEW

  useEffect(() => {
    let tempNotes = [...notes];

    // Filter by title
    if (text) {
      tempNotes = tempNotes.filter((note) =>
        note.title.toLowerCase().includes(text.toLowerCase())
      );
    }

    // Sort by date
    tempNotes.sort((a, b) => {
      const dateA = new Date(a.createdAt); // ✅ PAKAI createdAt
      const dateB = new Date(b.createdAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });


    setFilteredNotes(tempNotes);
  }, [text, notes, sortOrder]);

  return (
    <section className="lg:w-[80%] lg:p-10 h-[screen-4%] lg:gap-4 md:w-[90%] md:h-[90%] md:p-4 md:gap-3 flex justify-between items-center flex-col bg-[#171616] rounded-[12px] sm:w-[90%] sm:h-[90%] sm:p-3 sm:gap-3 w-full h-full p-2 gap-3">
      <header
        style={{ borderRadius: "7px 30px 30px 7px" }}
        className="notes_header lg:mb-3 h-[60px] w-full bg-[#1e1c1c] flex justify-between items-center pl-2 border-[1px] border-[#ffffff0a] border-solid"
      >
        {!showSearch && (
          <h2 className="text-[28px] text-white ml-5 font-['Poppu']">
            MyNotes
          </h2>
        )}
        {showSearch && (
          <input
            className="border-none outline-none bg-transparent text-white h-[80%] w-[60%] pl-6 text-[16px]"
            type="text"
            autoFocus
            onChange={(e) => setText(e.target.value)}
            placeholder="Keywords..."
          />
        )}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="rounded-full bg-gradient-to-br from-[#43CBFF] to-[#9708CC] flex items-center justify-center text-white w-[45px] h-[45px]"
        >
          {showSearch ? (
            <MdClose className="font-bold text-white" />
          ) : (
            <CiSearch className="font-bold" />
          )}
        </button>
      </header>

      {/* 🔽 Sort Dropdown */}
      <div className="flex justify-end w-full px-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-[#222] text-white p-2 rounded-md mb-2"
        >
          <option value="latest">Sort by Latest</option>
          <option value="earliest">Sort by Earliest</option>
        </select>
      </div>

      <div className="notes_container grid lg:grid-cols-4 md:grid-cols-3 md:mt-4 sm:grid-cols-2 xs:grid-col-1 flex-1 overflow-auto w-full gap-4 sm:mt-3 p-2 grid-cols-2">
        {filteredNotes.length == 0 && (
          <p className="text-white">No Notes Found!</p>
        )}
        {filteredNotes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </div>

      <Link
        to={"/create-note"}
        className="flex justify-center align-middle lg:w-[120px] md:w-[220px] sm:w-[320px] w-full gap-2 lg:mt-3 md:mt-3 sm:mt-3 mt-4 bg-gradient-to-br from-[#43CBFF] to-[#9708CC] text-green-50 p-2 rounded-md"
      >
        ADD
        <BsPlusLg className="self-center text-white text-lg font-extrabold" />
      </Link>
    </section>
  );
};

export default Notes;
