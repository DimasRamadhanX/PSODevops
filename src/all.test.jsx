import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NoteItem from "./components/NoteItem";
import useCreateDate from "./components/useCreateDate";

// Bersihkan DOM setelah setiap test
afterEach(() => cleanup());

// Mock data
const longTitle = "Judul Sangat Panjang Sekali Melebihi Dua Puluh Karakter";
const mockNote = {
  id: "123",
  title: longTitle,
  date: "Jun 10, 2025 [14:30]",
};

describe("🧾 NoteItem Component", () => {
  it("menampilkan judul yang dipotong jika panjang > 20 karakter", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNote} />
      </MemoryRouter>
    );

    // Mengecek teks terpotong
    const expectedTitle = longTitle.substring(0, 20) + "...";
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it("menampilkan tanggal catatan dengan benar", () => {
    render(
      <MemoryRouter>
        <NoteItem note={mockNote} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockNote.date)).toBeInTheDocument();
  });
});

describe("🕒 useCreateDate Hook", () => {
  const TestComponent = () => {
    const date = useCreateDate();
    return <p data-testid="generated-date">{date}</p>;
  };

  it("menghasilkan format tanggal yang sesuai: `Mon 1, 2025 [14:30]`", () => {
    render(<TestComponent />);
    const generated = screen.getByTestId("generated-date");

    // Format regex: "Jun 11, 2025 [14:30]"
    const regex = /^[A-Z][a-z]{2} \d{1,2}, \d{4} \[\d{2}:\d{2}\]$/;
    expect(generated.textContent).toMatch(regex);
  });
});
