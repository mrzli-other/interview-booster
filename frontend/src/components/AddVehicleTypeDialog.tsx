import React, { useState } from 'react';
import {
  Button,
  Dialog, DialogActions,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { AddVehicleInfoData } from '../types/vehicle-info';

interface AddVehicleTypeDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onAddVehicleType: (vehicleInfo: AddVehicleInfoData) => void;
}

export function AddVehicleTypeDialog(
  { isOpen, onClose, onAddVehicleType }: AddVehicleTypeDialogProps
): React.ReactElement {
  const [vehicleInfo, setVehicleInfo] = useState<AddVehicleInfoData>({ make: '', model: '', year: 2021 });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>Add New Vehicle Type</DialogTitle>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
        <TextField
          label={'Make'}
          required={true}
          value={vehicleInfo.make}
          onChange={(event) => { setVehicleInfo(vi => ({ ...vi, make: event.target.value.toUpperCase() })); }}
        />
        <br/>
        <TextField
          label={'Model'}
          required={true}
          value={vehicleInfo.model}
          onChange={(event) => { setVehicleInfo(vi => ({ ...vi, model: event.target.value.toUpperCase() })); }}
        />
        <br/>
        <TextField
          label={'Year'}
          required={true}
          type={'number'}
          value={vehicleInfo.year}
          onChange={(event) => { setVehicleInfo(vi => ({ ...vi, year: Number.parseInt(event.target.value) })); }}
        />
      </div>
      <DialogActions>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={() => { onAddVehicleType(vehicleInfo); }}
          disabled={vehicleInfo.make === '' || vehicleInfo.model === ''}
        >
          Ok
        </Button>
        <Button
          variant={'outlined'}
          color={'secondary'}
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
