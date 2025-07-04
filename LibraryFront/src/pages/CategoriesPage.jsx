import CategoryList from "../components/CategoryList";

function CategoriesPage() {
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Categories
      </h1>
      <CategoryList />
    </div>
  );
}

export default CategoriesPage;
