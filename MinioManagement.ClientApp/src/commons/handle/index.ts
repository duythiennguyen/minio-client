
export const handleOnchange = (value: any, name: string, state: any, setState: any) => {
  setState({ ...state, [name]: value });
};

export const handleOnClickCheckbox = (e: any, state: any, setState: any) => {
  const name = e.target.id || e.target.name;
  const value = e.target.checked ? 1 :0;
  setState({ ...state,  [name]: value });
};
