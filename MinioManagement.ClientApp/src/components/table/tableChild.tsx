import React from 'react';

import { useTranslation } from 'react-i18next';
import { rowComponents } from './optionTable';
import { tableIcons } from './../../components/table/tableIcon';
import MaterialTable, { Column, DetailPanel } from '@material-table/core';

interface ITableChild {
  title: string;
  columns: Column<object>[];
  data: [];
  key: any;
  editable: any;
  detailPanel?:
    | ((rowData: object) => React.ReactNode)
    | (DetailPanel<object> | ((rowData: object) => DetailPanel<object>))[];
  action: any;
}

const TableChild = (props: any) => {
  const objTable: ITableChild = props;
  const { t } = useTranslation();

  return (
    <MaterialTable
      title={objTable.title}
      columns={objTable.columns}
      data={objTable.data}
      actions={objTable.action}
      icons={tableIcons}
      key={objTable.key}
      options={{
        actionsColumnIndex: -1,
        toolbar: true,
        addRowPosition: 'first',
        paging: false,
        search: false,
        sorting: false,
        exportAllData:true,
        // columnsButton: { csv: true, pdf: false },
        overflowY: 'auto',
        headerStyle: {
          backgroundColor: '#0b72b9',
          color: '#fff',
          zIndex: 1,
        },
        rowStyle: (_data: any, index: number, _level: number) => {
          return index % 2 ? { backgroundColor: '#e9ecef' } : {};
        },
      }}
      detailPanel={objTable.detailPanel}
      editable={objTable.editable}
      components={rowComponents}
      localization={{
        header: {
          actions: t('common.function'),
        },
        error: t('message.errorExcution'),
        body: {
          emptyDataSourceMessage: t('message.noData'),
          filterRow: {
            filterPlaceHolder: t('common.filter'),
            filterTooltip: t('common.filter'),
          },
          editRow: {
            saveTooltip: t('common.save'),
            cancelTooltip: t('common.cancel'),
            deleteText: t('message.confirmDelete'),
          },
          addTooltip: t('common.add'),
          deleteTooltip: t('common.delete'),
          editTooltip: t('common.update'),
        },
        toolbar: {
          exportTitle: t('common.exportReport'),
          exportCSVName: t('common.exportCsv'),
          searchTooltip: t('common.search'),
          searchPlaceholder: t('common.search'),
        },
      }}
    />
  );
};

export default TableChild;
