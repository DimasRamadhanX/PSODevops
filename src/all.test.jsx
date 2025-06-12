import { describe, it, expect, afterEach } from "vitest";
/* global vi */
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import NoteItem from "./components/NoteItem";
import useCreateDate from "./components/useCreateDate";
import Notes from "./pages/Notes";
import CreateNote from "./pages/CreateNote";

// Bersihkan DOM setelah tiap test
afterEach(() => cleanup());

// Data tiruan
const longTitle = "Judul Sangat Panjang Sekali Melebihi Dua Puluh Karakter";
const shortTitle = "Catatan Singkat";

const mockNoteLong = {
  id: "123",
  title: longTitle,
  date: "Jun 10, 2025 [14:30]",
};
const mockNoteShort = {
  id: "456",
  title: shortTitle,
  date: "Jun 11, 2025 [09:00]",
};

// ==========================================
// ✅ NoteItem Component
// ==========================================
describe("🧾 NoteItem Component", () => {
  it("memotong judul jika > 20 karakter", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNoteLong} />
      </MemoryRouter>
    );
    const expected = longTitle.slice(0, 17) + "...";
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("menampilkan judul utuh jika ≤ 20 karakter", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNoteShort} />
      </MemoryRouter>
    );
    expect(screen.getByText(shortTitle)).toBeInTheDocument();
  });

  it("menampilkan tanggal catatan", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNoteLong} />
      </MemoryRouter>
    );
    expect(screen.getByText(mockNoteLong.date)).toBeInTheDocument();
  });

  it("link edit menuju /edit-note/:id", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNoteLong} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/edit-note/${mockNoteLong.id}`);
  });
});

// ==========================================
// ✅ useCreateDate Hook
// ==========================================
describe("🕒 useCreateDate Hook", () => {
  const TestComponent = () => {
    const date = useCreateDate();
    return <span data-testid="generated-date">{date.pretty}</span>;
  };

  it("menghasilkan format tanggal valid", () => {
    render(<TestComponent />);
    const generated = screen.getByTestId("generated-date");
    const regex = /^[A-Z][a-z]{2} \d{1,2}, \d{4} \[\d{2}:\d{2}\]$/;
    expect(generated.textContent).toMatch(regex);
  });
});

// ==========================================
// ✅ Notes Component (search & tampil)
// ==========================================
describe("📓 Notes Component", () => {
  it("menampilkan semua catatan", () => {
    render(
      <MemoryRouter>
        <Notes notes={[mockNoteLong, mockNoteShort]} />
      </MemoryRouter>
    );
    expect(screen.getByText(shortTitle)).toBeInTheDocument();
    expect(screen.getByText(longTitle.slice(0, 17) + "...")).toBeInTheDocument();
  });

  it("menampilkan pesan jika tidak ada catatan cocok", () => {
    render(
      <MemoryRouter>
        <Notes notes={[mockNoteShort]} />
      </MemoryRouter>
    );

    const toggle = screen.getByRole("button");
    fireEvent.click(toggle);

    const input = screen.getByPlaceholderText(/keywords/i);
    fireEvent.change(input, { target: { value: "ga ada" } });

    expect(screen.getByText(/no notes found/i)).toBeInTheDocument();
  });

  it("menampilkan hanya catatan yang cocok dengan keyword", () => {
    render(
      <MemoryRouter>
        <Notes notes={[mockNoteLong, mockNoteShort]} />
      </MemoryRouter>
    );

    const toggle = screen.getByRole("button");
    fireEvent.click(toggle);

    const input = screen.getByPlaceholderText(/keywords/i);
    fireEvent.change(input, { target: { value: "singkat" } });

    expect(screen.getByText(shortTitle)).toBeInTheDocument();
    expect(screen.queryByText(longTitle.slice(0, 17) + "...")).not.toBeInTheDocument();
  });
});

// ==========================================
// ✅ App Component - localStorage
// ==========================================
describe("🌐 App Component", () => {
  it("mengambil note dari localStorage", () => {
    const dummy = [{ id: "99", title: "Dari Storage", date: "Jun 9, 2025 [10:00]" }];
    localStorage.setItem("notes", JSON.stringify(dummy));

    render(<App />); // ⛔ TANPA <MemoryRouter>

    expect(screen.getByText("Dari Storage")).toBeInTheDocument();
  });
});

// ==========================================
// ✅ CreateNote Form - Simpan Catatan Baru
// ==========================================
describe("📝 CreateNote Form", () => {
  it("menambahkan catatan baru", () => {
    const mockSetNotes = vi.fn();

    render(
      <MemoryRouter>
        <CreateNote setNotes={mockSetNotes} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/title/i);
    fireEvent.change(input, { target: { value: "Catatan Baru" } });

    const details = screen.getByPlaceholderText(/notes/i);
    fireEvent.change(details, { target: { value: "Isi catatan" } });

    const save = screen.getByRole("button", { name: /save/i });
    fireEvent.click(save);

    // ✅ Verifikasi bahwa setNotes dipanggil
    expect(mockSetNotes).toHaveBeenCalled();

    // Optional: cek isi catatan baru
    const call = mockSetNotes.mock.calls[0][0];
    const newNotes = call([]);
    expect(newNotes[0].title).toBe("Catatan Baru");
  });
});


