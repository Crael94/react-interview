import { FC } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

interface IProps {
  choices: string[];
  selectedChoices: string[];
  inputLabel: string;
  handleChange: (value: string[]) => void;
}

const CategorySelect: FC<IProps> = ({
  choices,
  selectedChoices,
  inputLabel,
  handleChange,
}) => {
  const handleChangeSelect = (event: { target: { value: any } }) => {
    const {
      target: { value },
    } = event;
    handleChange(
      // On retrouve ici une spécificité de MUI Select multiple: value est un tableau.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl className="multi-select">
      <InputLabel id="multi-select-label">{inputLabel}</InputLabel>
      <Select
        labelId="category-multi-select-label"
        id="category-multi-select"
        multiple
        value={selectedChoices}
        onChange={handleChangeSelect}
        input={<OutlinedInput label={inputLabel} />}
        renderValue={(selected) => selected.join(", ")}
      >
        {choices.map((choice) => (
          <MenuItem key={choice} value={choice}>
            <Checkbox checked={selectedChoices.indexOf(choice) > -1} />
            <ListItemText primary={choice} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
