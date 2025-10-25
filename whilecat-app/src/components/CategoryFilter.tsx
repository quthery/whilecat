type CategoryFilterProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const categories = [
    "All",
    "Relax",
    "Sad",
    "Party",
    "Romance",
    "Energetic",
    "Relaxing",
    "Jazz",
    "Alternative",
  ];

  return (
    <section className="category-section">
      <h3 className="section-title">Select Categories</h3>
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}