import { useState, useEffect } from "react";
import { addLoan, fetchBooks, fetchMembers } from "../services/api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddLoan = () => {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [members, setMembers] = useState([]);
  const [loan, setLoan] = useState({
    bookId: "",
    memberId: "",
    loanDate: "",
    returnedDate: "",
    mustReturn: "",
  });

  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    try {
      const fetchedBooks = await fetchBooks();
      const fetchedMembers = await fetchMembers();

      setBooks(
        fetchedBooks.books ? 
          fetchedBooks.books.map((book) => ({ value: book.id, label: book.title })) :
          fetchedBooks.map((book) => ({ value: book.id, label: book.title }))
      );

      setMembers(
        fetchedMembers.members.map((member) => ({
          value: member.id,
          label: member.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);


  const handleChange = (e) => {
    setLoan({ ...loan, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption, action) => {
    setLoan({ ...loan, [action.name]: selectedOption?.value || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loanToSend = {
      ...loan,
      returnedDate: loan.returnedDate === "" ? null : loan.returnedDate,
    };
    console.log("Loan koji saljem", loan);
    try {
  await addLoan(loanToSend);
  navigate("/loans");
} catch (error) {
  if (
    error.response?.data?.message?.includes("aktivnu posudbu") ||
    error.message?.includes("aktivnu posudbu")
  ) {
    setErrorMessage("Korisnik već ima aktivnu posudbu za ovu knjigu.");
  } else {
    setErrorMessage("Došlo je do greške prilikom dodavanja posudbe. Korisnik ima već aktivnu posudbu za ovu knjigu");
    console.error("Greška pri dodavanju posudbe:", error);
  }
}};

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Add Loan
      </h1>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Member
          </label>
          <Select
            name="memberId"
            options={members}
            onChange={handleSelectChange}
            placeholder="Select a member"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book
          </label>
          <Select
            name="bookId"
            options={books}
            onChange={handleSelectChange}
            placeholder="Select a book"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Date
          </label>
          <input
            type="date"
            name="loanDate"
            value={loan.loanDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Must Return Date
          </label>
          <input
            type="date"
            name="mustReturn"
            value={loan.mustReturn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Returned Date
          </label>
          <input
            type="date"
            name="returnedDate"
            value={loan.returnedDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow"
          >
            Submit Loan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLoan;
