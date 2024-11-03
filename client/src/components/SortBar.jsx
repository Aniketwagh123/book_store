import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const SortBar = ({ sort, handleSortChange }) => {
  return (
    <FormControl variant="outlined" sx={{ marginBottom: 4, width: 200 }}>
      <InputLabel id="sort-label">Sort by</InputLabel>
      <Select
        labelId="sort-label"
        id="sort"
        value={sort}
        onChange={handleSortChange}
        label="Sort by"
      >
        <MenuItem value="relevance">Relevance</MenuItem>
        <MenuItem value="price-asc">Price: Low to High</MenuItem>
        <MenuItem value="price-desc">Price: High to Low</MenuItem>
        <MenuItem value="rating">Rating</MenuItem>
      </Select>
    </FormControl>
  );
};

SortBar.propTypes = {
  sort: PropTypes.string.isRequired, // Sort value should be a required string
  handleSortChange: PropTypes.func.isRequired, // handleSortChange should be a required function
};
export default SortBar;
