import React from 'react'
import { Icon, Item, Label, Input, Picker } from 'native-base'

export const TextNumberInput = props => {
  const { field, label, form, meta, select: picker, children } = props
  const { value, onChange, onBlur, name } = field || props

  const handleChange = (form && form.handleChange(name)) || onChange
  const handleBlur = (form && form.handleBlur(name)) || onBlur
  const error =
    form && form.getFieldMeta(name).touched && Number.isNaN(Number(value))

  return (
    <Item stackedLabel={!picker} error={error}>
      {label && <Label key="label">{label}</Label>}
      {picker ? (
        <Picker
          key="picker"
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          placeholder="Select fluid type"
          placeholderStyle={{ color: '#bfc6ea' }}
          placeholderIconColor="#007aff"
          selectedValue={value}
          onBlur={handleBlur}
          onValueChange={handleChange}>
          {children}
        </Picker>
      ) : (
        <Input
          key="input"
          keyboardType="numeric"
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          name={name}
        />
      )}
      {error && <Icon key="erroricon" name="close-circle" />}
    </Item>
  )
}

TextNumberInput.Item = Picker.Item

export default TextNumberInput
