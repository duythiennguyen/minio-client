import { Box, createStyles, Grid, MenuItem, Pagination, Select, Theme, Typography } from '@mui/material';
import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import './paging.scss'
interface IPaging {
  defaultRow?: number;
  totalRows: number;
  pageSize: number;
  currentPage: number;
  handlePageChange: Function;
  onRowChange: Function;
  rows?: number[];
}

const Paging = (props: IPaging) => {
  const defaultRow = props.defaultRow ? props.defaultRow : 10; // default rows per page
  const rows = props.rows ? props.rows : [10, 20, 50, 100]; // config rows per page
  const { t } = useTranslation();

  const { totalRows, pageSize, currentPage, handlePageChange, onRowChange } = props;

  const [row, setRow] = useState(defaultRow);

  const handleRowChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newRow = event.target.value as number;
    setRow(newRow);
    onRowChange(newRow);
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={6} md={8}>
          <Box display="flex">
            <Box m={1.5}>
              <Typography>{t('common.rowNumber')}: </Typography>
            </Box>
            <Box>
              <Select value={row}
                onChange={(event: any) => handleRowChange(event)}
                autoWidth
                className="table-select"
                disableUnderline>
                {rows.map((row, index) => (
                  <MenuItem value={row} key={index}>
                    {row}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box display={totalRows === 0 || totalRows <= pageSize ? 'none' : 'flex'} flexDirection="row-reverse">
            <Box>
              <Pagination
                page={currentPage}
                className="table-pageing"
                shape="rounded"
                size="small"
                color="primary"
                count={Math.ceil(totalRows / pageSize)}
                onChange={(e: any, page: number) => {
                  handlePageChange(page);
                }}
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Paging;
