import React, { useState, ReactNode, ReactElement, ChangeEvent } from 'react'
import {
  TextField,
  makeStyles,
  MenuItem,
  ListItemIcon,
  Typography,
  Paper,
  Chip,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

function asArray(value: any) {
  if (!value) return []

  return Array.isArray(value) ? value : [value]
}

const useStyles = makeStyles({
  listItemIcon: {
    minWidth: 0,
  },
  menuItem: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  option: {
    padding: 0,
  },
  clearIndicator: {
    display: 'none',
  },
})

interface SelectOption {
  icon?: ReactElement
  isCreate?: boolean
  label: string
  value: string
}

interface MaterialSelectProps {
  disabled?: boolean
  error?: boolean
  isLoading?: boolean
  label?: string
  multiple?: boolean // allow selecting multiple values
  noOptionsText?: ReactNode
  name?: string
  required?: boolean
  onChange: (value: SelectOption | SelectOption[]) => void
  onInputChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  value?: SelectOption[] | SelectOption
}

export default function MaterialSelect(props: MaterialSelectProps) {
  const classes = useStyles()
  const {
    disabled,
    error,
    isLoading,
    label,
    multiple,
    name,
    noOptionsText,
    onChange,
    onInputChange,
    options,
    placeholder,
    required,
    value: _value,
  } = props

  let value: SelectOption[] = asArray(_value)
  if (!multiple && !_value) value = [{ label: '', value: '' }]

  const [inputValue, setInputValue] = useState(multiple ? '' : value[0].label)

  return (
    <Autocomplete
      data-cy='material-select'
      data-cy-ready={!isLoading}
      classes={{
        option: classes.option,
        clearIndicator: classes.clearIndicator,
      }}
      value={value}
      inputValue={inputValue}
      disableClearable={required}
      disabled={disabled}
      multiple={multiple as any} // Autocomplete types as 'true' | omitted; we can't omit
      filterSelectedOptions
      noOptionsText={noOptionsText}
      onChange={(
        event: ChangeEvent<{}>,
        selected: SelectOption | SelectOption[],
      ) => {
        if (selected !== null) {
          if (Array.isArray(selected)) {
            setInputValue('')
          } else {
            setInputValue(selected.isCreate ? selected.value : selected.label)
          }
        }

        onChange(selected)
      }}
      onInputChange={(event, inputVal, reason) => {
        if (reason === 'clear' && !multiple) {
          setInputValue('')
        }
      }}
      onBlur={() => setInputValue(multiple ? '' : value[0].label)}
      loading={isLoading}
      getOptionLabel={option => option.label || ''}
      options={options}
      renderInput={params => {
        return (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              name,
            }}
            InputProps={
              {
                ...params.InputProps,
                'data-cy': 'search-select-input',
              } as any // just adding a data-cy attr
            }
            data-cy='search-select'
            fullWidth
            label={label}
            placeholder={placeholder}
            onChange={({ target }) => {
              const newInputVal: string = target.value
              setInputValue(newInputVal)
              if (onInputChange) onInputChange(newInputVal)
            }}
            error={error}
          />
        )
      }}
      renderOption={({ label, value, icon }) => (
        <MenuItem component='span' className={classes.menuItem}>
          <Typography noWrap>{label}</Typography>
          {icon && (
            <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
          )}
        </MenuItem>
      )}
      PaperComponent={params => <Paper data-cy='select-dropdown' {...params} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index.toString()}
            data-cy='multi-value'
            label={option.label}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  )
}
