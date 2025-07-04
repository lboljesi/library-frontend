import { motion } from "framer-motion";
import bookImage from "../../assets/books.svg";

function Home() {
  return (
    <div className="max-w-screen-lg mx-auto p-6 flex flex-col items-center text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Welcome to the Library System
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
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
