import React, { Key } from 'react';

import { useTranslation } from 'react-i18next';
import OptionsTable, { rowComponents } from './optionTable';
import { tableIcons } from './../../components/table/tableIcon';
import MaterialTable, { Column, Components, DetailPanel } from '@material-table/core';

interface ITable {
  key?: Key | null;
  title: '';
  columns: Column<object>[];
  data: any[];
  editable: any | undefined;
  rowExpand: boolean | false;
  detailPanel?:
    | ((rowData: object) => React.ReactNode)
    | (DetailPanel<object> | ((rowData: object) => DetailPanel<object>))[]
    | undefined;
  action: any | undefined;
  options: any | undefined;
  style?: React.CSSProperties;
  clickRow?: Function;
  rowComponents?: Components;
}

const Table = (props: any) => {
  const objTable: ITable = props;
  const { t } = useTranslation();
  return (
    <MaterialTable
      key={objTable.key}
      title={objTable.title}
      columns={objTable.columns}
      data={objTable.data}
      actions={objTable.action}
      icons={tableIcons}
      options={objTable.options ? objTable.options : OptionsTable}
      parentChildData={(row: any, rows:any) => rows.find((a: any) => (a.id ? a.id === row.parentId : null))}
      detailPanel={objTable.detailPanel}
      onRowClick={(event:any, rowData:any, togglePanel: any) =>
        objTable.rowExpand ? togglePanel() : objTable.clickRow !== undefined ? objTable.clickRow(rowData) : {}
      }
      editable={objTable.editable}
      components={objTable.rowComponents ? objTable.rowComponents : rowComponents}
      style={objTable.style}
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

export default Table;
