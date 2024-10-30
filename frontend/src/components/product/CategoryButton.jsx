import { DropdownButton, Dropdown } from "react-bootstrap";
import { CATEGORY_TYPES } from "../../constants";
import { useParams } from "react-router-dom";
import { redirectProductSearch } from "../../utils/navigationUtils";

const CategoryButton = () => {
  const { keyword, category: urlCategory, sort } = useParams();
  const getCategoryBtnTitle = () => {
    if (urlCategory) {
      return `Danh mục: ${
        urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
      }`;
    }
    return "Chọn danh mục";
  };

  const redirectHandler = (category) => {
    redirectProductSearch({ keyword, category, sort });
  };

  return (
    <DropdownButton
      variant="outline-secondary"
      id="dropdown-outlined-button text-capitalize"
      title={getCategoryBtnTitle()}
    >
      <Dropdown.Item
        key="categoryAll"
        onClick={() => redirectHandler("")}
        active={!urlCategory}
      >
        Tất cả
      </Dropdown.Item>
      {CATEGORY_TYPES.map((category) => (
        <Dropdown.Item
          key={category}
          className="text-capitalize"
          onClick={() => redirectHandler(category)}
          active={urlCategory === category}
        >
          {category}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default CategoryButton;
