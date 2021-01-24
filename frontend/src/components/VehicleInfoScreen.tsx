import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CreateVehicleInfoData, VehicleInfo } from '../types/vehicle-info';
import {
  Button,
  Checkbox,
  Paper, Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  // TablePagination,
  TableRow
} from '@material-ui/core';
import { AddVehicleTypeDialog } from './AddVehicleTypeDialog';
import {
  getVehicleInfoCount,
  getVehicleInfos,
  deleteVehicleInfos,
  createVehicleInfo
} from '../api/vehicle-info';
import { Alert, Pagination } from '@material-ui/lab';

interface SnackbarData {
  readonly type: 'error' | 'success';
  readonly message: string;
}

export function VehicleInfoScreen(): React.ReactElement {
  const [page, setPage] = useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const rowsPerPage = 10;
  const [selectedRows, setSelectedRows] = useState<readonly number[]>([]);

  const [addVehicleTypeDialogOpen, setAddVehicleTypeDialogOpen] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [vehicleInfos, setVehicleInfos] = useState<readonly VehicleInfo[]>([]);

  const [snackbarData, setSnackbarData] = useState<SnackbarData | undefined>(undefined);

  async function fetchVehicleInfoCount(): Promise<void> {
    const count = await getVehicleInfoCount();
    setTotalCount(count);
  }

  async function fetchVehicleInfos(): Promise<void> {
    const vehicleInfos = await getVehicleInfos(
      page * rowsPerPage,
      rowsPerPage,
      undefined,
      undefined,
      undefined
    );
    setVehicleInfos(vehicleInfos);
    setSelectedRows([]);
  }

  async function callCreateVehicleInfo(data: CreateVehicleInfoData): Promise<void> {
    const result = await createVehicleInfo(data);
    if (result.success) {
      setSnackbarData({ type: 'success', message: 'Created vehicle info' });
      setAddVehicleTypeDialogOpen(false);
    } else {
      setSnackbarData({ type: 'error', message: result.errors.join('; ') });
    }
  }

  async function callDeleteVehicleInfos(): Promise<void> {
    const numDeleted = await deleteVehicleInfos({ ids: selectedRows });
    setSnackbarData({ type: 'success', message: `Deleted ${numDeleted} vehicle info(s).` });
  }

  useEffect(
    () => {
      fetchVehicleInfoCount();
    },
    // eslint-disable-next-line
    []
  );

  useEffect(
    () => {
      fetchVehicleInfos();
    },
    // eslint-disable-next-line
    [page, rowsPerPage]
  );

  // function onChangePage(
  //   event: React.MouseEvent<HTMLButtonElement> | null,
  //   newPage: number
  // ): void {
  //   setPage(newPage);
  // }
  //
  // function onChangeRowsPerPage(
  //   event: React.ChangeEvent<HTMLInputElement>
  // ): void {
  //   setRowsPerPage(Number.parseInt(event.target.value));
  //   setPage(0);
  // }

  return (
    <>
      <Paper
        style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicleInfos.map((row) => createVehicleRowElement(row, selectedRows, setSelectedRows))}
            </TableBody>
          </Table>
        </TableContainer>
        {/*<TablePagination*/}
        {/*  style={{ flexShrink: 0 }}*/}
        {/*  rowsPerPageOptions={[10, 25, 100]}*/}
        {/*  component="div"*/}
        {/*  count={totalCount}*/}
        {/*  rowsPerPage={rowsPerPage}*/}
        {/*  page={page}*/}
        {/*  onChangePage={onChangePage}*/}
        {/*  onChangeRowsPerPage={onChangeRowsPerPage}*/}
        {/*/>*/}
        <Pagination
          style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}
          count={Math.ceil(totalCount / rowsPerPage)} // num pages
          page={page + 1} // Pagination page is 1-based, we use 0-based
          color="primary"
          onChange={(event: unknown, page: number) => { setPage(page - 1); }} // Pagination page is 1-based, we need 0-based
        />
        <div style={{ flexShrink: 0 }}>
          <Button
            style={{ margin: 5 }}
            variant={'contained'}
            color={'primary'}
            onClick={() => {
              setAddVehicleTypeDialogOpen(true);
            }}
          >
            Add New Vehicle Type
          </Button>
          <Button
            style={{ margin: 5 }}
            variant={'contained'}
            color={'secondary'}
            disabled={selectedRows.length === 0}
            onClick={async () => {
              await callDeleteVehicleInfos();
              await fetchVehicleInfoCount();
              await fetchVehicleInfos();
            }}
          >
            Delete Selected Vehicle Type(s)
          </Button>
        </div>
      </Paper>
      <>
        <AddVehicleTypeDialog
          isOpen={addVehicleTypeDialogOpen}
          onClose={() => {
            setAddVehicleTypeDialogOpen(false);
          }}
          onAddVehicleType={async (newVehicleInfo) => {
            await callCreateVehicleInfo(newVehicleInfo);
            await fetchVehicleInfoCount();
            await fetchVehicleInfos();
          }}
        />
        <Snackbar
          open={snackbarData !== undefined}
          autoHideDuration={6000}
          onClose={() => { setSnackbarData(undefined); }}>
          <Alert
            onClose={() => { setSnackbarData(undefined); }}
            severity={snackbarData?.type}
          >
            {snackbarData?.message}
          </Alert>
        </Snackbar>
      </>
    </>
  );
}

function createVehicleRowElement(
  vehicleInfo: VehicleInfo,
  selectedRows: readonly number[],
  setSelectedRows: Dispatch<SetStateAction<readonly number[]>>
): React.ReactElement {
  const id = vehicleInfo.id;
  const isSelected = selectedRows.includes(id);

  return (
    <TableRow
      hover={true}
      tabIndex={-1}
      key={id}
      onClick={() => {
        setSelectedRows(s => toggleSelected(s, id, isSelected));
      }}
      selected={isSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected}/>
      </TableCell>
      <TableCell>{vehicleInfo.make}</TableCell>
      <TableCell>{vehicleInfo.model}</TableCell>
      <TableCell>{vehicleInfo.year}</TableCell>
    </TableRow>
  )
}

function toggleSelected(
  selectedList: readonly number[],
  id: number,
  isPreviouslySelected: boolean
): readonly number[] {
  if (isPreviouslySelected) {
    return selectedList.filter(item => item !== id);
  } else {
    return [...selectedList, id];
  }
}
