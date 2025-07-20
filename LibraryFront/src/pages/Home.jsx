import { motion } from "framer-motion";
import bookImage from "../../assets/books.svg";

function Home() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Welcome to the Library System</h1>
        <p>
          Browse, manage and explore your collection of books and categories –
          simply and beautifully.
        </p>
      </motion.div>

      <motion.img
        src={bookImage}
        alt="Library Illustration"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md h-auto"
      />
    </div>
  );
}

export default Home;
