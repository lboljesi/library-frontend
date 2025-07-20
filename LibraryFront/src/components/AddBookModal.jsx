import AddBookForm from "./AddBookForm";

function AddBookModal({ isOpen, onClose, onBookAdded }) {
  if (!isOpen) return null;
  return (
    <div>
      <button onClick={onClose}>X</button>
      <AddBookForm
        onBookAdded={(book) => {
          onBookAdded(book);
          onClose();
        }}
      />
    </div>
  );
}
export default AddBookModal;
