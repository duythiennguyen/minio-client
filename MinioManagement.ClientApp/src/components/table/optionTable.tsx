import { Components, MTableEditRow, Options } from "@material-table/core";
const OptionsTable: Options<object> = {
  actionsColumnIndex: -1,
  addRowPosition: 'first',
  paging: false,
  search: true,
  sorting: false,
  exportAllData:true,
  overflowY: 'initial',
  maxBodyHeight: '75vh',
  minBodyHeight: '75vh',
  headerStyle: {
    backgroundColor: '#0b72b9',
    color: '#fff',
  },
  rowStyle: (_data: any, index: number, _level: number) => {
    return index % 2 ? { backgroundColor: '#e9ecef' } : {};
  },
};
export const rowComponents: Components = {
  EditRow: (props) => {
    return (
      <MTableEditRow
        {...props}
        className=""
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      />
    );
  },
};
export default OptionsTable;
