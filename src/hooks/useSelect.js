import { useState } from 'react';

export const useSelect = (initialState) => {
  const [selected, setSelected] = useState(initialState);

  const handleSelectButton = (selectedButton) => {
    setSelected(selectedButton);
  };

  return [selected, handleSelectButton];
};
