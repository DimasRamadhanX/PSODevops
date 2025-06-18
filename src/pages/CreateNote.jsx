/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { v4 as uuid } from "uuid";
import useCreateDate from "../components/useCreateDate";

const CreateNote = ({ setNotes }) => {
  // State untuk form utama
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const { pretty, iso } = useCreateDate();
  const navigate = useNavigate();

  // State untuk fitur AI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // State baru untuk menampung hasil dari AI sementara
  const [generatedNote, setGeneratedNote] = useState('');

  // Fungsi untuk menyimpan note (tidak diubah)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && details) {
      const note = {
        id: uuid(),
        title,
        details,
        date: pretty,
        createdAt: iso,
      };
      setNotes((prevNotes) => [note, ...prevNotes]);
      navigate("/");
    }
  };

  // --- Fungsi-fungsi baru untuk mengelola modal AI ---

  // Menutup dan mereset semua state terkait modal
  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setAiPrompt('');
    setGeneratedNote('');
    setIsLoading(false);
  };

  // Mengganti isi notes dengan hasil dari AI
  const handleReplaceNote = () => {
    setDetails(generatedNote);
    closeAndResetModal();
  };
  
  // Menambahkan hasil AI ke akhir notes yang sudah ada
  const handleAppendNote = () => {
    const newDetails = details ? `${details}\n\n${generatedNote}` : generatedNote;
    setDetails(newDetails);
    closeAndResetModal();
  };

  // Menjalankan proses pemanggilan API OpenAI
  const handleGenerateNote = async () => {
    if (!aiPrompt) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setGeneratedNote(''); // Selalu bersihkan hasil lama sebelum memulai
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
      
      // MODIFIKASI: Hasilnya disimpan ke state sementara, tidak langsung ke 'details'
      setGeneratedNote(generatedText);

    } catch (error) {
      console.error("Error generating note:", error);
      alert(`Failed to generate note. Please check the console for details.\nError: ${error.message}`);
      closeAndResetModal(); // Jika error, tutup dan reset modal
    } finally {
      // MODIFIKASI:isLoading di-set false, tapi modal tidak ditutup agar pilihan bisa muncul
      setIsLoading(false);
    }
  };


  return (
    <>
      <section className="lg:w-1/2 flex justify-center items-center gap-4 flex-col md:w-[80%] p-6 bg-[#141313] rounded-md sm:w-[90%] w-full">
        <header className="create_note_header flex justify-between items-center w-full ">
          <Link to={"/"} className="rounded-md bg-transparent text-white p-3 font-extrabold text-lg border-[2px] border-[#ffffff31] border-solid">
            <IoIosArrowBack />
          </Link>
          <button onClick={handleSubmit} className="rounded-md bg-transparent text-white px-4 py-2 border-[2px] border-[#ffffff31] lg:text-[18px] md:text-[16px] sm:text-[14px] text-[12px]">
            Save
          </button>
        </header>
        <form onSubmit={handleSubmit} className="create_note_form w-full gap-3 flex mt-3 flex-col items-center justify-center ">
          <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} autoFocus className="w-full outline-none p-4 text-2xl text-white bg-[#ffffff03] rounded-t-md border-[1px] border-[#ffffff1a] border-solid lg:text-[20px] md:text-[18px] sm:text-[18px] text-[16px]" />
          <div className="w-full px-1">
             <button type="button" onClick={() => setIsModalOpen(true)} className="w-full text-center py-2 px-4 bg-[#2a2a2a] text-white rounded-md border border-[#ffffff31] hover:bg-[#3a3a3a] transition-colors text-sm">
              ✨ Generate Notes with AI
            </button>
          </div>
          <textarea rows="10" placeholder="Enter Notes..." onChange={(e) => setDetails(e.target.value)} value={details} className="w-full outline-none text-white p-4 bg-[#ffffff03] resize-none rounded-b-md border-[1px] border-[#ffffff1a] border-solid lg:text-[18px] md:text-[16px] sm:text-[16px] text-[14px]"></textarea>
        </form>
      </section>

      {/* === MODAL DENGAN TAMPILAN DINAMIS === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#212121] p-6 rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col gap-4 border border-[#ffffff31]">
            
            {/* 1. Tampilan saat Loading */}
            {isLoading && (
              <div className="text-white text-center py-4">Generating... please wait.</div>
            )}

            {/* 2. Tampilan setelah AI selesai (menampilkan hasil & pilihan) */}
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

            {/* 3. Tampilan Awal (untuk memasukkan prompt) */}
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

export default CreateNote;
