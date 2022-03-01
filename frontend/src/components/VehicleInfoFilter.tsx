import React, { useState } from 'react';
import { Button, Paper, TextField } from '@material-ui/core';
import { VehicleInfoFilterData } from '../types/vehicle-info';

interface VehicleInfoFilterProps {
  readonly onSearch: (data: VehicleInfoFilterData) => void;
}

export function VehicleInfoFilter(
  { onSearch }: VehicleInfoFilterProps
): React.ReactElement {
  const [make, setMake] = useState<string | undefined>(undefined);
  const [model, setModel] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);

  return (
    <Paper style={{ display: 'flex', padding: 15 }}>
      <TextField
        style={{ marginRight: 15 }}
        label={'Make'}
        type={'search'}
        value={make ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          setMake(value ? value.toUpperCase() : undefined);
        }}
      />
      <br/>
      <TextField
        style={{ marginRight: 15 }}
        label={'Model'}
        type={'search'}
        value={model ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          setModel(value ? value.toUpperCase() : undefined);
        }}
      />
      <br/>
      <TextField
        style={{ marginRight: 15 }}
        label={'Year'}
        type={'search'}
        value={year ?? ''}
        onChange={(event) => {
          const value = event.target.value;
          const numValue = /^\d+$/.test(value) ? Number.parseInt(value) : undefined;
          setYear(numValue);
        }}
      />
      <Button
        variant={'contained'}
        color={'primary'}
        onClick={() => {
          onSearch({ make, model, year });
        }}
      >
        Search
      </Button>
    </Paper>
  );
}
