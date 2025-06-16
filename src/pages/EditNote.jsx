/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import useCreateDate from "../components/useCreateDate";

const EditNote = ({ notes, setNotes }) => {
  const { id } = useParams();
  const note = notes.find((item) => item.id == id);

  // State untuk form utama (tidak diubah)
  const [title, setTitle] = useState(note.title);
  const [details, setDetails] = useState(note.details);
  const { pretty, iso } = useCreateDate();
  const navigate = useNavigate();

  // --- State baru untuk fitur AI (dicopy dari CreateNote) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState('');

  // Fungsi untuk menyimpan perubahan (tidak diubah)
  const handleForm = (e) => {
    e.preventDefault();
    if (title && details) {
      const newNote = { ...note, title, details, date: pretty, createdAt: iso }; // date dan createdAt juga diperbarui
      const newNotes = notes.map((item) => {
        if (item.id == id) {
          item = newNote;
        }
        return item;
      });
      setNotes(newNotes);
    }
    navigate("/");
  };

  // Fungsi untuk menghapus note (tidak diubah)
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete ?")) {
      const newNotes = notes.filter((item) => item.id != id);
      setNotes(newNotes);
      navigate("/");
    }
  };

  // --- Fungsi-fungsi baru untuk mengelola modal AI (dicopy dari CreateNote) ---

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setAiPrompt('');
    setGeneratedNote('');
    setIsLoading(false);
  };

  const handleReplaceNote = () => {
    setDetails(generatedNote);
    closeAndResetModal();
  };
  
  const handleAppendNote = () => {
    const newDetails = details ? `${details}\n\n${generatedNote}` : generatedNote;
    setDetails(newDetails);
    closeAndResetModal();
  };

  const handleGenerateNote = async () => {
    if (!aiPrompt) {
      alert("Please enter a prompt.");
      return;
    }
    setIsLoading(true);
    setGeneratedNote('');
    const apiKey = import.meta.env.VITE_GPT_TOKEN;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful assistant that generates notes." },
            { role: "user", content: aiPrompt },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
      }
      
      const data = await response.json();
      const generatedText = data.choices[0].message.content.trim();
      setGeneratedNote(generatedText);
    } catch (error) {
      console.error("Error generating note:", error);
      alert(`Failed to generate note. Please check the console for details.\nError: ${error.message}`);
      closeAndResetModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Dibungkus dengan <> agar bisa menambahkan modal sebagai sibling
    <>
      <section className=" w-full lg:w-1/2 flex justify-center items-center gap-4 flex-col md:w-[80%] sm:w-[90%] p-6 bg-[#141313] rounded-md">
        <header className="create_note_header flex justify-between items-center w-full">
          <Link to={"/"} className="rounded-md bg-transparent text-white p-3 font-extrabold text-lg border-[2px] border-[#ffffff31] border-solid">
            <IoIosArrowBack />
          </Link>
          <div className="flex gap-1 items-center">
            <button onClick={handleForm} className="rounded-md bg-transparent text-white px-4 py-2 border-[2px] border-[#ffffff31] border-solid">
              Save
            </button>
            <button onClick={handleDelete} className="rounded-md bg-gradient-to-br from-[#43CBFF] to-[#9708CC] text-white p-3">
              <RiDeleteBin6Line />
            </button>
          </div>
        </header>
        <form onSubmit={handleForm} className="create_note_form w-full gap-3 flex mt-3 flex-col items-center justify-center">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus className="w-full outline-none p-4 text-2xl text-white bg-[#ffffff03] rounded-t-md border-[1px] border-[#ffffff1a] border-solid lg:text-[20px] md:text-[18px] sm:text-[18px] text-[16px]" />
          
          {/* Tombol AI ditambahkan di sini */}
          <div className="w-full px-1">
             <button type="button" onClick={() => setIsModalOpen(true)} className="w-full text-center py-2 px-4 bg-[#2a2a2a] text-white rounded-md border border-[#ffffff31] hover:bg-[#3a3a3a] transition-colors text-sm">
              ✨ Generate Notes with AI
            </button>
          </div>

          <textarea rows="10" value={details} onChange={(e) => setDetails(e.target.value)} className="w-full outline-none text-white p-4 bg-[#ffffff03] resize-none rounded-b-md border-[1px] border-[#ffffff1a] border-solid lg:text-[18px] md:text-[16px] sm:text-[16px] text-[14px]"></textarea>
        </form>
      </section>

      {/* Modal AI ditambahkan di sini (dicopy dari CreateNote) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#212121] p-6 rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col gap-4 border border-[#ffffff31]">
            
            {/* Tampilan saat Loading */}
            {isLoading && (
              <div className="text-white text-center py-4">Generating... please wait.</div>
            )}

            {/* Tampilan setelah AI selesai (menampilkan hasil & pilihan) */}
            {!isLoading && generatedNote && (
              <>
                <h3 className="text-white text-xl font-bold">AI Generated Result</h3>
                <div className="bg-[#ffffff09] border border-[#ffffff1a] rounded-md p-3 max-h-60 overflow-y-auto">
                  <p className="text-white whitespace-pre-wrap">{generatedNote}</p>
                </div>
                <p className="text-sm text-gray-400">What do you want to do with this text?</p>
                <div className="flex justify-end gap-3">
                  <button onClick={handleReplaceNote} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Replace</button>
                  <button onClick={handleAppendNote} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Append</button>
                  <button onClick={closeAndResetModal} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancel</button>
                </div>
              </>
            )}

            {/* Tampilan Awal (untuk memasukkan prompt) */}
            {!isLoading && !generatedNote && (
              <>
                <h3 className="text-white text-xl font-bold">Generate Notes with AI</h3>
                <textarea rows="4" placeholder="Enter your prompt here..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full outline-none text-white p-3 bg-[#ffffff09] resize-none rounded-md border border-[#ffffff1a]" />
                <div className="flex justify-end gap-3">
                  <button onClick={closeAndResetModal} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancel</button>
                  <button onClick={handleGenerateNote} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate</button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
    </>
  );
};

export default EditNote;
