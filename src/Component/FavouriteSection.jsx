import ProjectListItem from "./ProjectListItem";

const FavoritesSection = ({
  favorites,
  onEditProject,
  onDeleteProject,
  onToggleFavorite,
}) => {
  if (favorites.length === 0) {
    return null;
  }

  const favoriteItems = favorites.map((project) =>
    ProjectListItem({
      project,
      onEdit: onEditProject,
      onDelete: onDeleteProject,
      onFavorite: onToggleFavorite,
      isFavorite: true,
    })
  );

  return {
    key: "favorites",
    label: "Favorites",
    children: favoriteItems,
  };
};

export default FavoritesSection;
