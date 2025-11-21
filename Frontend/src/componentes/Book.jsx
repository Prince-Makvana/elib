import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    console.log("decoded",decoded);
    return decoded;
  } catch {
    return null;
  }
}

function getUserFromToken() {
  const token = localStorage.getItem("accessToken");
  const payload = parseJwt(token);
  if (payload)
    return {
      userId: payload.sub,
      name: payload.name || "",
      email: payload.email || "",
    };
  return { userId: null, name: "", email: "" };
}

const API_BASE = "/api/books";

const Book = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    genre: "",
    coverImage: "",
    file: "",
  });
  const [uploadCover, setUploadCover] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const user = getUserFromToken();

  const getBooks = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setBooks(data);
    } catch {
      setErrorMsg("Could not fetch books.");
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const openNewBookModal = () => {
    setEditingBook(null);
    setForm({ title: "", genre: "", coverImage: "", file: "" });
    setUploadCover(null);
    setUploadFile(null);
    setModalOpen(true);
    setErrorMsg("");
  };

  const openEditBookModal = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      genre: book.genre,
      coverImage: book.coverImage,
      file: book.file,
    });
    setUploadCover(null);
    setUploadFile(null);
    setModalOpen(true);
    setErrorMsg("");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "coverImage") setUploadCover(e.target.files[0]);
    if (e.target.name === "file") setUploadFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      let formData = new FormData();
      formData.append("title", form.title);
      formData.append("genre", form.genre);
      if (uploadCover) formData.append("coverImage", uploadCover);
      if (uploadFile) formData.append("file", uploadFile);

      let url = API_BASE;
      let method = "POST";
      if (editingBook) {
        url = `${API_BASE}/${editingBook._id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        setErrorMsg("Error saving book.");
        setLoading(false);
        return;
      }

      setModalOpen(false);
      getBooks();
    } catch {
      setErrorMsg("Network error.");
    }
    setLoading(false);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        getBooks();
      } else {
        setErrorMsg("Error deleting book.");
      }
    } catch {
      setErrorMsg("Network error.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // Only show books by logged-in user
  const myBooks = books.filter(
    (book) =>
      (book.author && (book.author._id === user.userId || book.author === user.userId)) ||
      book.author === user.userId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-teal-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">My Books</h1>
          <div className="flex gap-3 relative items-center">
            <button
              onClick={openNewBookModal}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-teal-700 transition"
            >
              + Add Book
            </button>
            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-blue-200 shadow hover:shadow-lg focus:outline-none"
              >
                {/* User Icon SVG */}
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A10.893 10.893 0 0112 15c2.21 0 4.268.664 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm7 1c0 6-4.477 11-10 11S2 18 2 12A10 10 0 1122 12z" />
                </svg>
              </button>
              {/* Profile Popup */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-4 px-6 z-20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 w-10 h-10 flex items-center justify-center rounded-full">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A10.893 10.893 0 0112 15c2.21 0 4.268.664 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm7 1c0 6-4.477 11-10 11S2 18 2 12A10 10 0 1122 12z" />
                      </svg>
                    </div>
                    <div>
                      
                      <div className="font-bold text-lg">{user.name || "User"}</div>
                      <div className="text-gray-600 text-sm break-all">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white rounded-xl px-4 py-2 font-semibold hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="text-red-500 font-semibold text-center mb-4">{errorMsg}</div>
        )}

        {/* Book Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {myBooks.length === 0 && (
            <div className="col-span-2 text-gray-500 text-center py-10">No books found! Add your first book.</div>
          )}
          {myBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white/90 rounded-2xl shadow-2xl p-6 relative border border-white/30 flex flex-col"
            >
              <img
                src={book.coverImage}
                alt="Cover"
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">{book.title}</h2>
                <h4 className="text-lg text-gray-600">Genre: {book.genre}</h4>
                <a
                  href={book.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-medium hover:underline"
                >
                  View PDF
                </a>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openEditBookModal(book)}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit Book */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              {editingBook ? "Update Book" : "Add New Book"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={form.genre}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                  required={!editingBook}
                />
                {form.coverImage && !uploadCover && (
                  <img
                    src={form.coverImage}
                    alt="Cover Preview"
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label className="block mb-1 font-semibold">Book File (PDF)</label>
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full"
                  required={!editingBook}
                />
              </div>
              {errorMsg && (
                <div className="text-red-500 text-sm text-center">{errorMsg}</div>
              )}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold px-5 py-2 rounded-xl hover:from-blue-700 hover:to-teal-700 transition shadow"
                >
                  {loading ? "Saving..." : editingBook ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="ml-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay to close profile on click-away */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-10"
          style={{ background: "transparent" }}
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default Book;
