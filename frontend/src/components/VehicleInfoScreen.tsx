import React, { Dispatch, SetStateAction, useState } from 'react';
import { AddVehicleInfoData, VehicleInfo } from '../types/vehicle-info';
import {
  Button,
  Checkbox,
  Paper,
  Table, TableBody, TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow
} from '@material-ui/core';
import { AddVehicleTypeDialog } from './AddVehicleTypeDialog';

interface VehicleInfoScreenProps {
  readonly vehicleInfos: readonly VehicleInfo[];
  readonly onAddVehicle: (vehicleInfo: AddVehicleInfoData) => void;
  readonly onDeleteVehicles: (ids: readonly string[]) => void;
}

export function VehicleInfoScreen(
  { vehicleInfos }: VehicleInfoScreenProps
): React.ReactElement {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<readonly string[]>([]);

  const [addVehicleTypeDialogOpen, setAddVehicleTypeDialogOpen] = useState<boolean>(false);

  function onChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void {
    setPage(newPage);
  }

  function onChangeRowsPerPage(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setRowsPerPage(Number.parseInt(event.target.value));
    setPage(0);
  }

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
              {vehicleInfos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => createVehicleRowElement(row, selectedRows, setSelectedRows))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          style={{ flexShrink: 0 }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={vehicleInfos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
        <div style={{ flexShrink: 0 }}>
          <Button
            style={{ margin: 5 }}
            variant={'contained'}
            color={'primary'}
            onClick={() => { setAddVehicleTypeDialogOpen(true); }}
          >
            Add New Vehicle Type
          </Button>
          <Button
            style={{ margin: 5 }}
            variant={'contained'}
            color={'secondary'}
            disabled={selectedRows.length === 0}
          >
            Delete Selected Vehicle Type(s)
          </Button>
        </div>
      </Paper>
      <>
        <AddVehicleTypeDialog
          isOpen={addVehicleTypeDialogOpen}
          onClose={() => { setAddVehicleTypeDialogOpen(false); }}
          onAddVehicleType={(newVehicleInfo) => {}}
        />
      </>
    </>
  );
}

function createVehicleRowElement(
  vehicleInfo: VehicleInfo,
  selectedRows: readonly string[],
  setSelectedRows: Dispatch<SetStateAction<readonly string[]>>
): React.ReactElement {
  const id = vehicleInfo._id.$oid;
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
  selectedList: readonly string[],
  id: string,
  isPreviouslySelected: boolean
): readonly string[] {
  if (isPreviouslySelected) {
    return selectedList.filter(item => item !== id);
  } else {
    return [...selectedList, id];
  }
}
